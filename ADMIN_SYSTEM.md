# Admin System Documentation

## Overview

The admin system provides comprehensive management and monitoring capabilities for the Zencall platform. It includes:

1. **Admin Dashboard** - Real-time metrics and KPIs
2. **Complaints Management** - AI-powered complaint detection and tracking
3. **Revenue Tracking** - Complete CA (Chiffre d'Affaires) monitoring
4. **Cost Tracking** - Infrastructure and AI usage costs
5. **Analytics** - Historical data and trends

## Domain

All administrative emails use the `zen-call.net` domain:
- `admin@zen-call.net` - Admin notifications
- `dpo@zen-call.net` - Data Protection Officer
- `support@zen-call.net` - Customer support
- `billing@zen-call.net` - Billing inquiries

## Architecture

### Database Schema

The admin system uses 5 main tables:

#### 1. admin_users
Stores admin user permissions and roles.

```sql
- id: UUID (primary key)
- user_id: UUID (references auth.users)
- role: 'super_admin' | 'admin' | 'viewer'
- permissions: JSONB
- created_at, updated_at
```

**Roles:**
- `super_admin` - Full access, can manage other admins
- `admin` - Can view and manage data, no admin management
- `viewer` - Read-only access to analytics

#### 2. analytics_metrics
Daily aggregated metrics for dashboard.

```sql
- metric_date: DATE (unique)
- total_users, new_users_today, active_users_today
- revenue_today_cents, costs_today_cents, profit_today_cents
- total_calls_today, total_minutes_today
- free_tier_users, starter_users, professional_users, enterprise_users
```

#### 3. complaints
User and AI-detected complaints.

```sql
- id: UUID
- user_id: UUID (nullable)
- call_id: UUID (nullable)
- complaint_type: 'service_quality' | 'billing' | 'technical' | 'legal' | 'other'
- severity: 'low' | 'medium' | 'high' | 'critical'
- title, description
- detected_by_ai: BOOLEAN
- ai_confidence_score: DECIMAL(3,2)
- ai_transcript: TEXT
- status: 'new' | 'in_progress' | 'resolved' | 'closed' | 'escalated'
```

#### 4. revenue_transactions
Detailed revenue tracking.

```sql
- id: UUID
- user_id: UUID
- transaction_type: 'subscription' | 'overage' | 'refund' | 'credit'
- amount_cents: BIGINT
- stripe_payment_id, stripe_invoice_id
- plan_type, billing_period
```

#### 5. cost_tracking
Infrastructure and AI costs.

```sql
- id: UUID
- cost_type: 'vapi_call' | 'twilio_sms' | 'twilio_call' | 'supabase' | 'hosting' | 'other'
- provider: VARCHAR(50)
- amount_cents: BIGINT
- quantity, unit, unit_price_cents
```

## Admin Dashboard

### Access

**URL:** `/admin`

**Requirements:**
- Authenticated user
- User must exist in `admin_users` table

### Features

#### Key Metrics (30-day view)
- **Total Clients** - Total user count with new users this month
- **CA (Revenue)** - Total revenue with profit margin
- **Costs** - Total costs with net profit
- **Complaints** - Open complaints with critical count

#### Secondary Metrics
- Total calls and minutes
- Active users today
- Average call duration

#### Recent Complaints Table
- AI-detected complaints highlighted with purple icon
- Severity badges (critical, high, medium, low)
- Status tracking (new, in progress, escalated, resolved)
- AI confidence scores

#### Today's Revenue & Costs
- Real-time transaction list
- Provider breakdown for costs
- Plan breakdown for revenue

## Complaints Management

### URL: `/admin/complaints`

### Features

#### Statistics Bar
- Total complaints
- New complaints
- In progress
- Escalated
- Resolved
- AI-detected
- Critical severity

#### Filtering
- By status (new, in progress, resolved, etc.)
- By severity (critical, high, medium, low)
- By type (service quality, billing, technical, legal, other)
- AI-only filter

#### Complaints Table
- Checkbox selection for bulk actions
- AI detection indicator (purple chip icon)
- Severity badges with icons
- Source (AI with confidence % or User)
- Status badges
- Direct link to associated call
- Action buttons (Traiter, View details)

### AI Complaint Detection

AI agents (Vapi.ai) can submit complaints via API when they detect issues during calls.

#### API Endpoint

**POST** `/api/admin/complaints/ai`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "user_id": "uuid-here",
  "call_id": "uuid-here", 
  "title": "Customer expressed frustration with billing",
  "description": "Customer mentioned unexpected charges during conversation",
  "transcript": "Full call transcript here...",
  "complaint_type": "billing",
  "severity": "medium",
  "confidence_score": 0.85,
  "api_key": "your-api-key"
}
```

**Response (201):**
```json
{
  "success": true,
  "complaint_id": "uuid-here",
  "complaint": { ... },
  "message": "Complaint created successfully"
}
```

#### Vapi.ai Integration Example

In your Vapi.ai assistant configuration, add a webhook to detect complaints:

```javascript
// Vapi.ai Server Message Handler
app.post('/vapi/webhook', async (req, res) => {
  const { message, call, transcript } = req.body;
  
  // Analyze transcript for complaint indicators
  const complaintIndicators = [
    'frustrated', 'unhappy', 'cancel', 'refund',
    'disappointed', 'angry', 'problem', 'issue'
  ];
  
  const transcriptText = transcript.toLowerCase();
  const hasComplaint = complaintIndicators.some(word => 
    transcriptText.includes(word)
  );
  
  if (hasComplaint) {
    // Determine severity based on sentiment
    const severity = transcriptText.includes('cancel') || 
                    transcriptText.includes('angry') ? 'high' : 'medium';
    
    // Submit to complaints API
    await fetch('https://zen-call.net/api/admin/complaints/ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: call.customer.id,
        call_id: call.id,
        title: 'Customer expressed dissatisfaction during call',
        description: `Negative sentiment detected in conversation`,
        transcript: transcript,
        complaint_type: 'service_quality',
        severity: severity,
        confidence_score: 0.75,
        api_key: process.env.AI_COMPLAINT_API_KEY,
      }),
    });
  }
  
  res.sendStatus(200);
});
```

## Analytics API

### Record Daily Analytics

**POST** `/api/admin/analytics/record`

Manually trigger daily analytics snapshot. Should be called by cron job.

**Headers:**
```
Authorization: Bearer {CRON_SECRET}
```

**Response:**
```json
{
  "success": true,
  "message": "Daily analytics recorded successfully",
  "timestamp": "2025-01-15T00:00:00.000Z"
}
```

### Get Analytics

**GET** `/api/admin/analytics?days=30`

Get comprehensive analytics for specified period.

**Response:**
```json
{
  "success": true,
  "period_days": 30,
  "summary": {
    "total_users": 1234,
    "new_users_period": 145,
    "total_revenue_cents": 125000,
    "total_costs_cents": 45000,
    "profit_cents": 80000,
    "profit_margin": 64.0,
    "open_complaints": 5,
    "critical_complaints": 1
  },
  "daily_metrics": [...]
}
```

## Cost Tracking API

### Track Cost

**POST** `/api/admin/costs/track`

Record a new cost entry (called by webhooks or manually).

**Body:**
```json
{
  "cost_type": "vapi_call",
  "provider": "vapi",
  "amount_cents": 1250,
  "currency": "EUR",
  "user_id": "uuid-here",
  "call_id": "uuid-here",
  "quantity": 5.5,
  "unit": "minutes",
  "unit_price_cents": 227,
  "description": "AI call processing",
  "api_key": "your-api-key"
}
```

### Get Costs

**GET** `/api/admin/costs?days=30&provider=vapi`

Retrieve cost records with filtering.

**Response:**
```json
{
  "success": true,
  "count": 45,
  "total_cents": 125000,
  "by_provider": {
    "vapi": 85000,
    "twilio": 30000,
    "supabase": 10000
  },
  "costs": [...]
}
```

## Revenue Tracking API

### Track Revenue

**POST** `/api/admin/revenue/track`

Record a new revenue transaction (called by Stripe webhooks).

**Body:**
```json
{
  "user_id": "uuid-here",
  "transaction_type": "subscription",
  "amount_cents": 4900,
  "currency": "EUR",
  "stripe_payment_id": "pi_xxx",
  "stripe_invoice_id": "in_xxx",
  "plan_type": "professional",
  "billing_period": "monthly",
  "description": "Professional plan - January 2025",
  "api_key": "your-api-key"
}
```

### Get Revenue

**GET** `/api/admin/revenue?days=30&plan_type=professional`

Retrieve revenue records with filtering.

**Response:**
```json
{
  "success": true,
  "count": 123,
  "total_cents": 567890,
  "subscriptions_cents": 550000,
  "refunds_cents": 12110,
  "net_revenue_cents": 555780,
  "by_plan": {
    "free": 0,
    "starter": 125000,
    "professional": 325000,
    "enterprise": 117890
  },
  "transactions": [...]
}
```

## Database Functions

### is_admin(user_id)

Check if a user has admin privileges.

```sql
SELECT public.is_admin('user-uuid-here');
-- Returns: true/false
```

### get_admin_dashboard_metrics(days)

Get comprehensive dashboard metrics.

```sql
SELECT * FROM public.get_admin_dashboard_metrics(30);
```

Returns:
- total_users
- new_users_period
- active_users_today
- total_revenue_cents
- total_costs_cents
- profit_cents
- profit_margin
- total_calls
- total_minutes
- avg_call_duration
- open_complaints
- critical_complaints

### record_daily_analytics()

Record daily analytics snapshot (called by cron).

```sql
SELECT public.record_daily_analytics();
```

### create_ai_complaint(...)

Create a complaint from AI agent detection.

```sql
SELECT public.create_ai_complaint(
  p_user_id := 'user-uuid',
  p_call_id := 'call-uuid',
  p_title := 'Customer frustration detected',
  p_description := 'Customer mentioned billing issues',
  p_transcript := 'Full transcript...',
  p_complaint_type := 'billing',
  p_severity := 'medium',
  p_confidence_score := 0.85
);
-- Returns: complaint_id UUID
```

## Environment Variables

Add these to your `.env.local`:

```bash
# Admin API Keys
AI_COMPLAINT_API_KEY=your-secure-key-here
COST_TRACKING_API_KEY=your-secure-key-here
REVENUE_TRACKING_API_KEY=your-secure-key-here
CRON_SECRET=your-cron-secret-here

# Can be same key or different for each endpoint
```

## Setting Up Cron Jobs

### Option 1: Vercel Cron Jobs

Add to `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/admin/analytics/record",
      "schedule": "0 0 * * *"
    }
  ]
}
```

### Option 2: Supabase pg_cron

```sql
-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule daily analytics at midnight UTC
SELECT cron.schedule(
  'record-daily-analytics',
  '0 0 * * *',
  $$SELECT public.record_daily_analytics();$$
);
```

### Option 3: External Cron Service

Use services like:
- Cron-job.org
- EasyCron
- GitHub Actions

```yaml
# .github/workflows/daily-analytics.yml
name: Record Daily Analytics
on:
  schedule:
    - cron: '0 0 * * *'
jobs:
  record:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Analytics
        run: |
          curl -X POST https://zen-call.net/api/admin/analytics/record \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
```

## Creating Your Admin Account

After deploying the admin system:

1. **Register a normal user account** at `/register`
2. **Get your user ID** from Supabase auth.users table
3. **Insert admin record** in Supabase SQL Editor:

```sql
INSERT INTO public.admin_users (user_id, role, permissions, created_by)
VALUES (
  'your-user-uuid-here',
  'super_admin',
  '{
    "view_analytics": true,
    "view_complaints": true,
    "manage_users": true,
    "manage_billing": true
  }'::jsonb,
  'your-user-uuid-here'
);
```

4. **Access admin panel** at `/admin`

## Permissions

The `permissions` JSONB field supports:

- `view_analytics` - Can view analytics dashboard
- `view_complaints` - Can view complaints
- `manage_users` - Can manage other admins (super_admin only)
- `manage_billing` - Can access billing data

Example permission sets:

```json
// Super Admin (full access)
{
  "view_analytics": true,
  "view_complaints": true,
  "manage_users": true,
  "manage_billing": true
}

// Admin (no user management)
{
  "view_analytics": true,
  "view_complaints": true,
  "manage_users": false,
  "manage_billing": true
}

// Viewer (read-only)
{
  "view_analytics": true,
  "view_complaints": true,
  "manage_users": false,
  "manage_billing": false
}
```

## Security

### Row Level Security (RLS)

All tables have RLS enabled with policies:

- **admin_users** - Only admins can view, only super_admins can modify
- **analytics_metrics** - Only admins can view, service role can manage
- **complaints** - Users see own complaints, admins see all
- **revenue_transactions** - Users see own transactions, admins see all
- **cost_tracking** - Only admins can view

### API Authentication

Three authentication methods:

1. **User Session** - For logged-in admins via dashboard
2. **API Key** - For webhooks and external integrations
3. **Service Role** - For database functions and cron jobs

## Monitoring

### Key Metrics to Watch

1. **Profit Margin** - Should stay above 50%
2. **Critical Complaints** - Should be 0
3. **Active Users** - Growth trend
4. **AI Costs** - Monitor per-call costs

### Alerts

Set up alerts for:
- Critical complaints (immediate notification)
- Profit margin drops below 40%
- Cost spike (>20% increase day-over-day)
- Revenue drop (>15% decrease week-over-week)

## Deployment

1. **Apply migration:**
   ```bash
   supabase db push
   # or manually in Supabase SQL Editor
   ```

2. **Set environment variables:**
   ```bash
   vercel env add AI_COMPLAINT_API_KEY
   vercel env add COST_TRACKING_API_KEY
   vercel env add REVENUE_TRACKING_API_KEY
   vercel env add CRON_SECRET
   ```

3. **Deploy:**
   ```bash
   git add .
   git commit -m "Add admin system"
   git push
   ```

4. **Create admin account** (see above)

5. **Set up cron jobs** (see above)

6. **Configure webhooks:**
   - Stripe webhook → `/api/admin/revenue/track`
   - Vapi webhook → `/api/admin/complaints/ai`
   - Twilio webhook → `/api/admin/costs/track`

## Support

For admin system issues, contact:
- Technical: `admin@zen-call.net`
- Data Protection: `dpo@zen-call.net`
- General: `support@zen-call.net`
