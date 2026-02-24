#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { HarmonicStack } from "../lib/harmonic-stack";

const app = new cdk.App();

const certificateArn = process.env.CERTIFICATE_ARN;
if (!certificateArn) {
  throw new Error(
    "CERTIFICATE_ARN is required. Create an ACM cert for harmonic.nickwenner.com " +
    "in us-east-1, validate DNS, then set CERTIFICATE_ARN."
  );
}

new HarmonicStack(app, "HarmonicStack", {
  certificateArn,
  domainName: app.node.tryGetContext("domainName") ?? "harmonic.nickwenner.com",
  // ssmApiKeyName defaults to /harmonic/anthropic-api-key
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: "us-east-2",
  },
});
