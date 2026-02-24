# The Other Side

> Practice the hardest kind of conversation — with someone who genuinely sees it differently.

A CDI dialogue practice tool. Pick a topic, meet a realistic AI conversation partner who holds a different view, and practice constructive engagement.

---

## Architecture

```
harmonic.nickwenner.com
    ↓ CloudFront → S3
React SPA (Vite + TypeScript + Tailwind)
    ↓ POST (fetch to Lambda Function URL)
AWS Lambda (Node.js 20, arm64) — bundled with esbuild
    ↓
Anthropic Claude API (claude-sonnet-4-6)
```

---

## Deploy

All infrastructure is managed by **AWS CDK** (`cdk/`). A single `cdk deploy` provisions and updates everything: Lambda, Function URL, S3 bucket, CloudFront distribution, and ACM certificate.

### Prerequisites

- AWS CLI configured (`aws configure`)
- CDK bootstrapped once per account/region: `cd cdk && npx cdk bootstrap`
- Node 20+

### First deploy

```bash
# 1. Build the frontend (CDK uploads dist/ to S3 during deploy)
cd frontend
VITE_API_URL=placeholder npm run build   # real URL set after first deploy

# 2. Deploy infrastructure
cd ../cdk
npm install

export ANTHROPIC_API_KEY=sk-ant-...

# Option A: you manage DNS in Route53
export HOSTED_ZONE_ID=Z1234567890ABC   # hosted zone for nickwenner.com
npx cdk deploy

# Option B: manual DNS (e.g. Cloudflare, Namecheap)
npx cdk deploy
# → CDK prints the CloudFront domain — add it as a CNAME for harmonic.nickwenner.com
# → CDK also prints a DNS record to validate the ACM certificate — add that too
```

### After first deploy — fix the frontend API URL

The Lambda Function URL is printed as a CDK output (`LambdaFunctionUrl`). Rebuild the frontend with the real URL, then redeploy:

```bash
cd frontend
echo "VITE_API_URL=https://xxxx.lambda-url.us-east-1.on.aws/" > .env.production
npm run build

cd ../cdk
npx cdk deploy   # uploads new dist/ to S3 + invalidates CloudFront
```

### Subsequent deploys

```bash
# Backend changes (Lambda code):
cd cdk && ANTHROPIC_API_KEY=sk-ant-... npx cdk deploy

# Frontend changes (UI only):
cd frontend && npm run build
cd ../cdk && ANTHROPIC_API_KEY=sk-ant-... npx cdk deploy
```

CDK detects what changed and only updates those resources.

---

## Local Dev

```bash
# Frontend only (no backend needed for UI work)
cd frontend && npm run dev
# Uses VITE_API_URL from .env.local (defaults to http://localhost:3001)
```

---

## Project Structure

```
harmonic/
├── frontend/                         # Vite + React + TypeScript + Tailwind
│   ├── src/
│   │   ├── components/
│   │   │   ├── TopicSelector.tsx     # Step 1: pick topic + optional stance
│   │   │   ├── PersonaCard.tsx       # Sticky header showing AI partner info
│   │   │   ├── ChatInterface.tsx     # Main chat loop + fixed input bar
│   │   │   ├── MessageBubble.tsx     # User/AI message styling
│   │   │   ├── TypingIndicator.tsx   # Animated dots while waiting for reply
│   │   │   └── ConversationEnd.tsx   # Reflection + perspective-shift check-in
│   │   ├── hooks/
│   │   │   └── useConversation.ts    # All state management + API calls
│   │   ├── types/index.ts
│   │   ├── App.tsx                   # State machine: select → chat → end
│   │   └── main.tsx
│   └── .env.local                    # VITE_API_URL for local dev
│
├── backend/                          # AWS Lambda (Node.js 20)
│   └── src/handler.ts                # 3 endpoints: generate_persona, chat, reflection
│
└── cdk/                              # AWS CDK (TypeScript)
    ├── bin/harmonic.ts               # App entry — reads ANTHROPIC_API_KEY from env
    ├── lib/harmonic-stack.ts         # Stack: Lambda + S3 + CloudFront + ACM
    └── cdk.json                      # App command + feature flags
```
