import * as path from "path";
import { execSync } from "child_process";
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as iam from "aws-cdk-lib/aws-iam";
import * as ssm from "aws-cdk-lib/aws-ssm";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as acm from "aws-cdk-lib/aws-certificatemanager";

export interface HarmonicStackProps extends cdk.StackProps {
  /**
   * ARN of an existing ACM certificate in us-east-1 for the custom domain.
   * CloudFront requires certs in us-east-1 regardless of the stack region.
   */
  certificateArn: string;
  /** Custom domain, default: harmonic.nickwenner.com */
  domainName?: string;
  /**
   * SSM parameter name holding the Anthropic API key (SecureString).
   * Default: /harmonic/anthropic-api-key
   */
  ssmApiKeyName?: string;
}

// esbuild lives in cdk/node_modules — resolve relative to this file so synth
// works regardless of the working directory it's invoked from.
const ESBUILD_BIN = path.join(__dirname, "../node_modules/.bin/esbuild");
const BACKEND_ENTRY = path.join(__dirname, "../../backend/src/handler.ts");
const BACKEND_DIR = path.join(__dirname, "../../backend");

export class HarmonicStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: HarmonicStackProps) {
    super(scope, id, props);

    const domain = props.domainName ?? "harmonic.nickwenner.com";
    const ssmApiKeyName = props.ssmApiKeyName ?? "/harmonic/anthropic-api-key";

    // ─── Lambda (bundled with local esbuild via Code.fromAsset) ───────────────
    // We use lambda.Function + Code.fromAsset instead of NodejsFunction so we
    // can provide a `local` bundler that calls cdk/node_modules/.bin/esbuild
    // directly — NodejsFunction uses `npx --no-install esbuild` from the CWD,
    // which fails in monorepos where esbuild isn't at the repo root.
    const fn = new lambda.Function(this, "ApiFunction", {
      functionName: "harmonic-the-other-side",
      code: lambda.Code.fromAsset(BACKEND_DIR, {
        bundling: {
          local: {
            tryBundle(outputDir: string): boolean {
              execSync(
                `"${ESBUILD_BIN}" --bundle "${BACKEND_ENTRY}" \
                  --target=node20 --platform=node \
                  --outfile="${outputDir}/index.js" \
                  --external:@aws-sdk/* \
                  --minify`,
                { stdio: "inherit" }
              );
              return true;
            },
          },
          // Docker fallback (not used locally, but required by CDK's type)
          image: lambda.Runtime.NODEJS_20_X.bundlingImage,
          command: [
            "bash", "-c",
            `npx esbuild --bundle /asset-input/src/handler.ts \
              --target=node20 --platform=node \
              --outfile=/asset-output/index.js --minify`,
          ],
        },
      }),
      handler: "index.handler",
      runtime: lambda.Runtime.NODEJS_20_X,
      architecture: lambda.Architecture.ARM_64,
      timeout: cdk.Duration.seconds(30),
      memorySize: 256,
      environment: {
        // Pass the SSM parameter *name* (not the secret value) to Lambda.
        // The handler fetches + decrypts it at cold start via the SSM SDK.
        SSM_API_KEY_NAME: ssmApiKeyName,
        ALLOWED_ORIGIN: `https://${domain}`,
      },
    });

    // Grant Lambda permission to read + decrypt the SSM SecureString
    const apiKeyParam = ssm.StringParameter.fromSecureStringParameterAttributes(
      this,
      "ApiKeyParam",
      { parameterName: ssmApiKeyName }
    );
    apiKeyParam.grantRead(fn);

    // Also grant kms:Decrypt on the default SSM key (needed for SecureString)
    fn.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["kms:Decrypt"],
        resources: ["*"],
        conditions: {
          StringEquals: { "kms:ViaService": `ssm.${this.region}.amazonaws.com` },
        },
      })
    );

    // ─── Lambda Function URL (CORS locked to frontend domain) ──────────────────
    const fnUrl = fn.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
      cors: {
        allowedOrigins: [`https://${domain}`],
        allowedMethods: [lambda.HttpMethod.POST],
        allowedHeaders: ["content-type"],
        maxAge: cdk.Duration.hours(24),
      },
    });

    // ─── S3 bucket for frontend assets ─────────────────────────────────────────
    const siteBucket = new s3.Bucket(this, "SiteBucket", {
      bucketName: `harmonic-the-other-side-${this.account}`,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // ─── ACM Certificate (imported by ARN — must live in us-east-1) ────────────
    const certificate = acm.Certificate.fromCertificateArn(
      this,
      "Certificate",
      props.certificateArn
    );

    // ─── CloudFront distribution ────────────────────────────────────────────────
    const distribution = new cloudfront.Distribution(this, "Distribution", {
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(siteBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
      },
      domainNames: [domain],
      certificate,
      defaultRootObject: "index.html",
      // SPA fallback: return index.html for any 403/404 from S3
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: "/index.html",
          ttl: cdk.Duration.seconds(0),
        },
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: "/index.html",
          ttl: cdk.Duration.seconds(0),
        },
      ],
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
    });

    // ─── Outputs ────────────────────────────────────────────────────────────────
    new cdk.CfnOutput(this, "SiteBucketName", {
      value: siteBucket.bucketName,
      description: "S3 bucket for frontend assets",
    });
    new cdk.CfnOutput(this, "LambdaFunctionUrl", {
      value: fnUrl.url,
      description: "Lambda Function URL",
    });
    new cdk.CfnOutput(this, "CloudFrontDomain", {
      value: distribution.distributionDomainName,
      description: "Add as CNAME for harmonic.nickwenner.com",
    });
    new cdk.CfnOutput(this, "CloudFrontDistributionId", {
      value: distribution.distributionId,
    });
    new cdk.CfnOutput(this, "SiteUrl", {
      value: `https://${domain}`,
    });
  }
}
