import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckCircle2, 
  ArrowRight, 
  Database, 
  GitBranch, 
  Zap, 
  LineChart, 
  Layout, 
  Settings,
  Layers,
  Sparkles
} from 'lucide-react';
import BackgroundGrid from '../components/BackgroundGrid';
import Magnetic from '../components/Magnetic';

// Service Data Configuration
const servicesData: Record<string, {
  title: string;
  subtitle: string;
  description: React.ReactNode;
  icon: React.ReactNode;
  features: string[];
  images: string[];
  color: string;
}> = {
  'account-infrastructure': {
    title: "Account Infrastructure",
    subtitle: "The Foundation of Scalability",
    description: (
      <>
        Most GoHighLevel problems are not caused by bad automations.
        {"\n"}They come from a weak foundation.
        {"\n"}{"\n"}
        If domains, permissions, and compliance are configured incorrectly, you will see emails landing in spam, users breaking workflows, conversations getting lost, and accounts getting restricted. This service fixes that before you scale.
        {"\n"}{"\n"}
        I set up your GoHighLevel environment the same way a production system is prepared before launch. Every sending channel is authenticated, every user has controlled access, and every sub account follows a predictable structure your team can safely operate inside.
        {"\n"}{"\n"}
        <strong className="text-[#1d1d1f] dark:text-white">Who This Is For</strong>
        {"\n"}{"\n"}
        Businesses or agencies that are about to use GoHighLevel seriously, not just test it.
        {"\n"}{"\n"}
        You should expect this to fit if you
        {"\n"}{"\n"}
        • Plan to run email or SMS campaigns
        {"\n"}• Have multiple team members accessing the account
        {"\n"}• Want to avoid deliverability issues early
        {"\n"}• Are onboarding clients regularly
        {"\n"}• Need a stable system before building automations
        {"\n"}{"\n"}
        <strong className="text-[#1d1d1f] dark:text-white">What I Actually Do</strong>
        {"\n"}{"\n"}
        I handle the technical setup that normally causes silent failures later.
        {"\n"}{"\n"}
        Infrastructure preparation
        {"\n"}• Configure sending domains and tracking domains
        {"\n"}• Authenticate SPF, DKIM, and DMARC correctly
        {"\n"}• Set reply routing and inbox handling
        {"\n"}{"\n"}
        Account architecture
        {"\n"}• Create logical naming conventions for locations and assets
        {"\n"}• Design user roles and permission hierarchy
        {"\n"}• Lock critical areas to prevent workflow damage
        {"\n"}{"\n"}
        Compliance and protection
        {"\n"}• Prepare messaging compliance requirements
        {"\n"}• Implement opt in and opt out handling
        {"\n"}• Apply security settings and account safeguards
        {"\n"}{"\n"}
        <strong className="text-[#1d1d1f] dark:text-white">Typical Timeline</strong>
        {"\n"}{"\n"}
        Most infrastructure setups are completed within <strong className="text-[#1d1d1f] dark:text-white">about one week</strong> once access to domains and accounts is available.
        {"\n"}{"\n"}
        Smaller single location accounts may finish faster.
        {"\n"}Large agency environments or accounts requiring approvals can take longer due to DNS propagation and provider verification times.
        {"\n"}{"\n"}
        You will always receive a working environment ready for use at handoff, not a partially configured setup.
        {"\n"}{"\n"}
        <strong className="text-[#1d1d1f] dark:text-white">What You Should Expect</strong>
        {"\n"}{"\n"}
        You will not receive a messy account with settings half configured.
        {"\n"}{"\n"}
        You will receive
        {"\n"}• A ready to use GoHighLevel environment
        {"\n"}• Verified email deliverability setup
        {"\n"}• Controlled user access for your team
        {"\n"}• A structure that can scale without breaking
        {"\n"}{"\n"}
        <strong className="text-[#1d1d1f] dark:text-white">The Result</strong>
        {"\n"}{"\n"}
        • Campaigns send without unexpected blocking
        {"\n"}• Team members cannot accidentally damage automations
        {"\n"}• Client onboarding becomes repeatable
        {"\n"}• You build workflows on a stable system instead of repairing problems later
        {"\n"}{"\n"}
        <strong className="text-[#1d1d1f] dark:text-white">This Is Not For</strong>
        {"\n"}{"\n"}
        • People just exploring the platform
        {"\n"}• One person accounts sending occasional messages
        {"\n"}• Anyone wanting instant mass cold email without warm up
        {"\n"}• Anyone who already heavily customized their account and refuses structural changes
        {"\n"}{"\n"}
        This is a foundation service. It prevents problems. It does not patch chaos.
      </>
    ),
    icon: <Database className="w-8 h-8" />,
    color: "purple",
    features: [
      "Domain & DNS Configuration",
      "Mailgun / LC Email Dedicated IP Setup",
      "A2P 10DLC Brand & Campaign Registration",
      "User Permissions & Staff Management",
      "Phone Number Procurement & Regulatory Bundles",
      "Security & 2FA Enforcement Policies"
    ],
    images: [
      "https://storage.googleapis.com/msgsndr/P7WTdwLMsDsnEHkSqqXD/media/698f6043772de937a7da722c.png",
      "https://storage.googleapis.com/msgsndr/P7WTdwLMsDsnEHkSqqXD/media/698f6043c6490f034b43142c.png"
    ]
  },
  'advanced-workflows': {
    title: "Advanced Workflows",
    subtitle: "Intelligent Automation Logic",
    description: (
      <>
        Most businesses automate actions. Very few automate decisions.
        {"\n"}{"\n"}
        This service builds logic driven workflows that react to behavior, timing, and data conditions across your stack. Instead of every lead receiving the same follow up, the system evaluates what actually happened and responds accordingly.
        {"\n"}{"\n"}
        I design and implement production ready automations using n8n, Make, and Zapier connected to your CRM, communication channels, databases, and internal tools. The goal is not more automations. The goal is fewer manual decisions.
        {"\n"}{"\n"}
        <strong className="text-[#1d1d1f] dark:text-white">Who This Is For</strong>
        {"\n"}{"\n"}
        Businesses that already operate daily inside their systems and want to remove repetitive operational thinking.
        {"\n"}{"\n"}
        You should expect this to fit if you
        {"\n"}{"\n"}
        • Manually check pipelines or inboxes throughout the day
        {"\n"}• Send follow ups based on status changes
        {"\n"}• Move data between platforms regularly
        {"\n"}• Handle onboarding, billing, reminders, or reporting manually
        {"\n"}• Need processes to run even when no one is online
        {"\n"}{"\n"}
        <strong className="text-[#1d1d1f] dark:text-white">What I Actually Do</strong>
        {"\n"}{"\n"}
        I design workflow logic first, then implement it across platforms.
        {"\n"}{"\n"}
        Process mapping
        {"\n"}• Document how decisions are currently made by your team
        {"\n"}• Identify triggers, conditions, and outcomes
        {"\n"}• Convert human decisions into rule based logic
        {"\n"}{"\n"}
        Automation development
        {"\n"}• Build workflows in n8n, Make, or Zapier
        {"\n"}• Create branching paths and conditional filters
        {"\n"}• Connect APIs, webhooks, and databases
        {"\n"}• Handle retries, delays, and edge cases
        {"\n"}{"\n"}
        System behavior control
        {"\n"}• Prevent duplicate actions
        {"\n"}• Add safety checks and fallbacks
        {"\n"}• Log activity and execution history
        {"\n"}• Ensure workflows continue operating after unexpected failures
        {"\n"}{"\n"}
        <strong className="text-[#1d1d1f] dark:text-white">Typical Timeline</strong>
        {"\n"}{"\n"}
        Simple workflows may be completed within a few days.
        {"\n"}Operational systems that involve multiple platforms typically take <strong className="text-[#1d1d1f] dark:text-white">1 to 3 weeks</strong> depending on complexity, number of decision branches, and testing requirements.
        {"\n"}{"\n"}
        Time is spent validating behavior, not just making triggers fire.
        {"\n"}You receive automations that run reliably, not prototypes that break under real usage.
        {"\n"}{"\n"}
        <strong className="text-[#1d1d1f] dark:text-white">What You Should Expect</strong>
        {"\n"}{"\n"}
        You will not receive disconnected zaps or one off automations.
        {"\n"}{"\n"}
        You will receive
        {"\n"}• Structured workflows that follow real operational logic
        {"\n"}• Clear trigger conditions and predictable outcomes
        {"\n"}• Centralized automation architecture
        {"\n"}• Systems that continue running without supervision
        {"\n"}{"\n"}
        <strong className="text-[#1d1d1f] dark:text-white">The Result</strong>
        {"\n"}{"\n"}
        • Daily manual checking is removed
        {"\n"}• Follow ups happen at the correct time automatically
        {"\n"}• Data stays consistent across platforms
        {"\n"}• Operations run whether the team is online or not
        {"\n"}{"\n"}
        <strong className="text-[#1d1d1f] dark:text-white">This Is Not For</strong>
        {"\n"}{"\n"}
        • Businesses looking for a single quick automation
        {"\n"}• Anyone wanting hundreds of tasks automated without defined process
        {"\n"}• Teams that frequently change their workflow every week
        {"\n"}• Projects expecting instant deployment without testing
        {"\n"}{"\n"}
        This service replaces operational workload. It does not create temporary shortcuts.
      </>
    ),
    icon: <GitBranch className="w-8 h-8" />,
    color: "indigo",
    features: [
      "Behavior-Based Branching Logic",
      "Webhook & API Integrations",
      "Automated Database Reactivation",
      "Appointment Reminders & Confirmations",
      "Lead Nurturing Sequences",
      "Cross-Channel Marketing (SMS, Email, VMN)"
    ],
    images: [
      "https://storage.googleapis.com/msgsndr/P7WTdwLMsDsnEHkSqqXD/media/698f5d93c6490f39f3428e40.png",
      "https://storage.googleapis.com/msgsndr/P7WTdwLMsDsnEHkSqqXD/media/698f5d93fb408f6f18d091d8.jpeg"
    ]
  },
  'pipeline-engineering': {
    title: "Pipeline Engineering",
    subtitle: "Structuring How Revenue Actually Moves",
    description: (
      <>
        Most CRMs record deals.
        {"\n"}Very few enforce how deals should progress.
        {"\n"}{"\n"}
        This service designs a controlled pipeline system where every stage represents a real business state, not just a label. Instead of sales teams deciding what to do next, the pipeline determines the next action automatically based on movement, timing, and deal conditions.
        {"\n"}{"\n"}
        The goal is not tracking deals.
        {"\n"}The goal is guiding them.
        {"\n"}{"\n"}
        I build structured pipelines inside GoHighLevel that trigger the correct actions at the correct time so follow ups, tasks, and outcomes happen without relying on memory.
        {"\n"}{"\n"}
        <strong className="text-[#1d1d1f] dark:text-white">Who This Is For</strong>
        {"\n"}{"\n"}
        Teams actively working inside their CRM who want consistency and predictable deal movement.
        {"\n"}{"\n"}
        This fits if your team
        {"\n"}{"\n"}
        • Manually decides when to follow up
        {"\n"}• Moves opportunities between stages inconsistently
        {"\n"}• Forgets inactive deals until they are already lost
        {"\n"}• Sends contracts late or manually
        {"\n"}• Has no reliable revenue forecast
        {"\n"}• Treats the pipeline as a list instead of a process
        {"\n"}{"\n"}
        <strong className="text-[#1d1d1f] dark:text-white">What I Actually Do</strong>
        {"\n"}{"\n"}
        I design pipeline logic first, then connect automation behavior to it.
        {"\n"}{"\n"}
        Process Modeling
        {"\n"}• Map how a deal progresses from first contact to payment
        {"\n"}• Define what each stage truly means operationally
        {"\n"}• Assign measurable entry and exit conditions
        {"\n"}• Establish expected timeframes per stage
        {"\n"}{"\n"}
        Pipeline System Build
        {"\n"}• Create structured stages inside GoHighLevel
        {"\n"}• Implement automatic actions on stage movement
        {"\n"}• Send agreements when deals reach closing state
        {"\n"}• Create follow up tasks based on deal behavior
        {"\n"}• Assign ownership automatically
        {"\n"}{"\n"}
        Revenue Control & Monitoring
        {"\n"}• Detect stalled opportunities automatically
        {"\n"}• Trigger recovery sequences for inactive leads
        {"\n"}• Recycle lost deals into nurture campaigns
        {"\n"}• Calculate weighted revenue forecasts
        {"\n"}• Maintain clean deal data across the pipeline
        {"\n"}{"\n"}
        <strong className="text-[#1d1d1f] dark:text-white">Typical Timeline</strong>
        {"\n"}{"\n"}
        Simple pipelines: a few days
        {"\n"}Operational pipelines with forecasting and recovery logic: <strong className="text-[#1d1d1f] dark:text-white">1 to 2 weeks</strong>
        {"\n"}{"\n"}
        Time is spent validating deal behavior and edge cases so the pipeline works under real daily usage, not only during testing.
        {"\n"}{"\n"}
        <strong className="text-[#1d1d1f] dark:text-white">What You Should Expect</strong>
        {"\n"}{"\n"}
        You will not receive a CRM with stages only.
        {"\n"}{"\n"}
        You will receive
        {"\n"}• A pipeline that enforces process behavior
        {"\n"}• Automatic next steps for every deal movement
        {"\n"}• Predictable follow up timing
        {"\n"}• Clean forecasting visibility
        {"\n"}• A system that prevents forgotten opportunities
        {"\n"}{"\n"}
        <strong className="text-[#1d1d1f] dark:text-white">The Result</strong>
        {"\n"}{"\n"}
        • Sales teams stop guessing what to do next
        {"\n"}• Follow ups happen on time automatically
        {"\n"}• Stalled deals resurface before they die
        {"\n"}• Forecasts reflect reality instead of estimates
        {"\n"}• The pipeline becomes operational infrastructure, not a dashboard
        {"\n"}{"\n"}
        <strong className="text-[#1d1d1f] dark:text-white">This Is Not For</strong>
        {"\n"}{"\n"}
        • Businesses that only want a visual pipeline layout
        {"\n"}• Teams unwilling to follow a defined process
        {"\n"}• One off CRM setup requests without operational logic
        {"\n"}• Organizations constantly redefining their sales flow weekly
        {"\n"}{"\n"}
        This service replaces manual pipeline management.
        {"\n"}It does not add another tool to maintain.
      </>
    ),
    icon: <Zap className="w-8 h-8" />,
    color: "orange",
    features: [
      "Structured Deal Stage Architecture",
      "Automated Stage Entry and Exit Actions",
      "Stale Opportunity Detection",
      "Lost Deal Reactivation Sequences",
      "Probability Based Revenue Forecasting",
      "Sales Task Assignment Rules",
      "GoHighLevel Integration Setup"
    ],
    images: [
      "https://assets.cdn.filesafe.space/P7WTdwLMsDsnEHkSqqXD/media/699942bf08245e88c227ee8b.png",
      "https://assets.cdn.filesafe.space/P7WTdwLMsDsnEHkSqqXD/media/6999435e08245e50b0280967.png"
    ]
  },
  'custom-dashboards': {
    title: "Custom Dashboards",
    subtitle: "Turning Activity Into Measurable Signals",
    description: (
      <>
        Most businesses collect data.
        {"\n"}Very few structure it for decisions.
        {"\n"}{"\n"}
        This service builds operational dashboards inside GoHighLevel that show what requires action, not just what happened. Instead of scrolling through contacts, conversations, and reports, the system surfaces the metrics that actually determine performance.
        {"\n"}{"\n"}
        The goal is not reporting.
        {"\n"}The goal is clarity.
        {"\n"}{"\n"}
        I design dashboards that translate CRM activity into readable indicators so owners and managers immediately know where attention is required.
        {"\n"}{"\n"}
        <strong className="text-[#1d1d1f] dark:text-white">Who This Is For</strong>
        {"\n"}{"\n"}
        Teams using their CRM daily but still relying on manual checking or assumptions.
        {"\n"}{"\n"}
        This fits if you
        {"\n"}{"\n"}
        • Check multiple tabs to understand performance
        {"\n"}• Cannot quickly tell if lead flow is improving or declining
        {"\n"}• Review conversations to evaluate agents manually
        {"\n"}• Track marketing results outside the CRM
        {"\n"}• Export data to spreadsheets for visibility
        {"\n"}• Lack a single place showing operational health
        {"\n"}{"\n"}
        <strong className="text-[#1d1d1f] dark:text-white">What I Actually Do</strong>
        {"\n"}{"\n"}
        I define decision metrics first, then design dashboards around them.
        {"\n"}{"\n"}
        Metric Design
        {"\n"}• Identify which numbers influence real business actions
        {"\n"}• Define formulas for conversion and movement tracking
        {"\n"}• Establish performance baselines
        {"\n"}• Remove vanity metrics that do not affect decisions
        {"\n"}{"\n"}
        Dashboard Build
        {"\n"}• Create structured dashboards inside GoHighLevel
        {"\n"}• Display lead velocity and stage movement
        {"\n"}• Track conversion rates across pipeline stages
        {"\n"}• Monitor agent activity and responsiveness
        {"\n"}• Present campaign attribution and ROI indicators
        {"\n"}{"\n"}
        Data Consolidation
        {"\n"}• Integrate external sources when required
        {"\n"}• Standardize data formatting across tools
        {"\n"}• Prevent duplicate counting
        {"\n"}• Ensure metrics remain accurate over time
        {"\n"}{"\n"}
        <strong className="text-[#1d1d1f] dark:text-white">Typical Timeline</strong>
        {"\n"}{"\n"}
        Basic operational dashboards: a few days
        {"\n"}Multi source performance dashboards: <strong className="text-[#1d1d1f] dark:text-white">about 1 week</strong> depending on integrations
        {"\n"}{"\n"}
        Time is spent validating calculations and ensuring numbers match real outcomes.
        {"\n"}{"\n"}
        <strong className="text-[#1d1d1f] dark:text-white">What You Should Expect</strong>
        {"\n"}{"\n"}
        You will not receive generic charts.
        {"\n"}{"\n"}
        You will receive
        {"\n"}• Metrics connected to operational decisions
        {"\n"}• Consistent measurement across teams
        {"\n"}• Immediate visibility into performance changes
        {"\n"}• A dashboard that reduces manual checking
        {"\n"}{"\n"}
        <strong className="text-[#1d1d1f] dark:text-white">The Result</strong>
        {"\n"}{"\n"}
        • Managers know where intervention is needed
        {"\n"}• Marketing effectiveness becomes measurable
        {"\n"}• Agent performance becomes visible
        {"\n"}• Reports no longer require exporting or manual analysis
        {"\n"}• Decisions are made from signals instead of assumptions
        {"\n"}{"\n"}
        <strong className="text-[#1d1d1f] dark:text-white">This Is Not For</strong>
        {"\n"}{"\n"}
        • Businesses wanting aesthetic reports only
        {"\n"}• Teams without defined processes to measure
        {"\n"}• One time data exports
        {"\n"}• Organizations unwilling to standardize tracking
        {"\n"}{"\n"}
        This service replaces manual reporting effort.
        {"\n"}It does not create decorative analytics.
      </>
    ),
    icon: <LineChart className="w-8 h-8" />,
    color: "green",
    features: [
      "Custom KPI Dashboard Design",
      "Lead Velocity Tracking",
      "Conversion Rate Measurement",
      "Agent Performance Indicators",
      "Campaign Attribution & ROI View",
      "External Data Source Integration",
      "Data Accuracy Validation"
    ],
    images: [
      "https://storage.googleapis.com/msgsndr/P7WTdwLMsDsnEHkSqqXD/media/69455c890190af4582ea97b9.png",
      "https://assets.cdn.filesafe.space/P7WTdwLMsDsnEHkSqqXD/media/6999459edf9bdf09c282d746.png"
    ]
  },
  'snapshot-development': {
    title: "Snapshot Development",
    subtitle: "Replicating Systems Without Rebuilding Them",
    description: (
      <>
        Most agencies build accounts repeatedly.
        {"\n"}Very few deploy environments.
        {"\n"}{"\n"}
        This service creates fully structured GoHighLevel Snapshots that package your funnels, workflows, pipelines, settings, and standards into a deployable system. Instead of rebuilding setups for every client or location, the entire operational structure can be launched instantly and remain consistent.
        {"\n"}{"\n"}
        The goal is not faster setup.
        {"\n"}The goal is identical execution.
        {"\n"}{"\n"}
        I design snapshots that behave like controlled templates so every new account follows the same operational logic from day one.
        {"\n"}{"\n"}
        <strong className="text-[#1d1d1f] dark:text-white">Who This Is For</strong>
        {"\n"}{"\n"}
        Agencies, franchises, and multi location businesses that repeatedly configure similar systems.
        {"\n"}{"\n"}
        This fits if you
        {"\n"}{"\n"}
        • Recreate the same workflows for every new client
        {"\n"}• Spend hours configuring new sub accounts
        {"\n"}• Struggle to maintain consistency across locations
        {"\n"}• Have onboarding delays due to manual setup
        {"\n"}• Fix the same configuration mistakes repeatedly
        {"\n"}• Need standardized delivery across multiple accounts
        {"\n"}{"\n"}
        <strong className="text-[#1d1d1f] dark:text-white">What I Actually Do</strong>
        {"\n"}{"\n"}
        I standardize the system first, then package it into a deployable structure.
        {"\n"}{"\n"}
        System Standardization
        {"\n"}• Audit existing funnels, workflows, and pipelines
        {"\n"}• Define the universal structure that should repeat
        {"\n"}• Separate customizable elements from fixed logic
        {"\n"}• Establish naming and asset structure standards
        {"\n"}{"\n"}
        Snapshot Architecture
        {"\n"}• Build a complete GoHighLevel snapshot
        {"\n"}• Configure pipelines, automations, and settings
        {"\n"}• Implement reusable custom values and mappings
        {"\n"}• Prepare onboarding ready templates
        {"\n"}• Ensure compatibility across sub accounts
        {"\n"}{"\n"}
        Lifecycle Control
        {"\n"}• Manage global asset updates
        {"\n"}• Implement version tracking structure
        {"\n"}• Maintain upgrade safe deployment process
        {"\n"}• Prevent configuration drift across accounts
        {"\n"}{"\n"}
        <strong className="text-[#1d1d1f] dark:text-white">Typical Timeline</strong>
        {"\n"}{"\n"}
        Simple operational snapshots: a few days
        {"\n"}Complex multi service or franchise systems: <strong className="text-[#1d1d1f] dark:text-white">1 to 2 weeks</strong> depending on scope and testing
        {"\n"}{"\n"}
        Time is spent validating deployment behavior so the snapshot works reliably across multiple new accounts.
        {"\n"}{"\n"}
        <strong className="text-[#1d1d1f] dark:text-white">What You Should Expect</strong>
        {"\n"}{"\n"}
        You will not receive a folder of templates.
        {"\n"}{"\n"}
        You will receive
        {"\n"}• A deployable operational environment
        {"\n"}• Consistent configuration across all accounts
        {"\n"}• Faster onboarding without manual rebuilding
        {"\n"}• Controlled updates without breaking existing setups
        {"\n"}{"\n"}
        <strong className="text-[#1d1d1f] dark:text-white">The Result</strong>
        {"\n"}{"\n"}
        • New accounts launch in minutes
        {"\n"}• Delivery becomes standardized
        {"\n"}• Setup errors are eliminated
        {"\n"}• Scaling no longer increases operational workload
        {"\n"}• Your process becomes a repeatable product
        {"\n"}{"\n"}
        <strong className="text-[#1d1d1f] dark:text-white">This Is Not For</strong>
        {"\n"}{"\n"}
        • One off client setups
        {"\n"}• Businesses without repeatable services
        {"\n"}• Teams frequently changing core system structure
        {"\n"}• Projects requiring heavy customization per account
        {"\n"}{"\n"}
        This service replaces repetitive configuration work.
        {"\n"}It does not create generic templates.
      </>
    ),
    icon: <Layout className="w-8 h-8" />,
    color: "blue",
    features: [
      "Industry Specific System Templates",
      "One Click Sub Account Deployment",
      "Global Asset Management Structure",
      "Version Control & Update Strategy",
      "Custom Value & Variable Mapping",
      "SOP Ready Configuration Structure"
    ],
    images: [
      "https://assets.cdn.filesafe.space/P7WTdwLMsDsnEHkSqqXD/media/6999474a20c0354fd77f1943.png",
      "https://assets.cdn.filesafe.space/P7WTdwLMsDsnEHkSqqXD/media/699947a5df9bdf3325832bfb.png"
    ]
  },
  'system-audits': {
    title: "System Audits",
    subtitle: "Understanding Why the System Behaves the Way It Does",
    description: (
      <>
        Most CRM problems appear random.
        {"\n"}They are usually structural.
        {"\n"}{"\n"}
        This service analyzes your GoHighLevel environment to locate the exact causes of slow performance, duplicate actions, missed triggers, and inconsistent data. Instead of guessing which automation is responsible, the system is inspected as a whole so behavior becomes explainable and correctable.
        {"\n"}{"\n"}
        The goal is not fixing symptoms.
        {"\n"}The goal is restoring reliability.
        {"\n"}{"\n"}
        I examine how workflows, tags, triggers, integrations, and user activity interact so the platform operates predictably under daily usage.
        {"\n"}{"\n"}
        <strong className="text-[#1d1d1f] dark:text-white">Who This Is For</strong>
        {"\n"}{"\n"}
        Teams already using GoHighLevel but experiencing inconsistent or confusing behavior.
        {"\n"}{"\n"}
        This fits if you
        {"\n"}{"\n"}
        • Contacts receive duplicate or incorrect messages
        {"\n"}• Automations trigger at the wrong time
        {"\n"}• Opportunities move unexpectedly in the pipeline
        {"\n"}• The account feels slow or cluttered
        {"\n"}• Users hesitate to modify workflows out of fear of breaking something
        {"\n"}• You inherited a system built by multiple people over time
        {"\n"}{"\n"}
        <strong className="text-[#1d1d1f] dark:text-white">What I Actually Do</strong>
        {"\n"}{"\n"}
        I trace system behavior first, then isolate root causes.
        {"\n"}{"\n"}
        Structural Analysis
        {"\n"}• Review workflows, triggers, and conditions
        {"\n"}• Identify conflicting or overlapping automations
        {"\n"}• Map how contacts move across the system
        {"\n"}• Detect logic loops and redundant actions
        {"\n"}{"\n"}
        Data Integrity Review
        {"\n"}• Audit tags, custom fields, and contact records
        {"\n"}• Remove unused or duplicated identifiers
        {"\n"}• Correct stage and status inconsistencies
        {"\n"}• Ensure accurate reporting inputs
        {"\n"}{"\n"}
        Security & Performance Check
        {"\n"}• Inspect integrations and webhook behavior
        {"\n"}• Validate permissions and access structure
        {"\n"}• Locate broken links and outdated assets
        {"\n"}• Evaluate funnel loading performance
        {"\n"}{"\n"}
        <strong className="text-[#1d1d1f] dark:text-white">Typical Timeline</strong>
        {"\n"}{"\n"}
        Small accounts: a few days
        {"\n"}Large or legacy systems: <strong className="text-[#1d1d1f] dark:text-white">about 1 week</strong> depending on complexity and number of assets
        {"\n"}{"\n"}
        Time is spent verifying each finding so recommendations are based on confirmed behavior, not assumptions.
        {"\n"}{"\n"}
        <strong className="text-[#1d1d1f] dark:text-white">What You Should Expect</strong>
        {"\n"}{"\n"}
        You will not receive a vague list of suggestions.
        {"\n"}{"\n"}
        You will receive
        {"\n"}• A documented explanation of system behavior
        {"\n"}• Clear identification of root causes
        {"\n"}• A prioritized correction plan
        {"\n"}• Confidence to modify the system safely
        {"\n"}{"\n"}
        <strong className="text-[#1d1d1f] dark:text-white">The Result</strong>
        {"\n"}{"\n"}
        • Automations behave predictably
        {"\n"}• Duplicate or conflicting actions stop
        {"\n"}• Data becomes consistent and reliable
        {"\n"}• Users regain trust in the platform
        {"\n"}• Future changes can be made without breaking workflows
        {"\n"}{"\n"}
        <strong className="text-[#1d1d1f] dark:text-white">This Is Not For</strong>
        {"\n"}{"\n"}
        • New accounts without active usage yet
        {"\n"}• Businesses expecting instant full rebuilds
        {"\n"}• One time troubleshooting without documentation
        {"\n"}• Teams unwilling to maintain defined structure
        {"\n"}{"\n"}
        This service restores system stability.
        {"\n"}It does not add more automations.
      </>
    ),
    icon: <Settings className="w-8 h-8" />,
    color: "pink",
    features: [
      "Comprehensive System Health Report",
      "Automation Conflict Detection",
      "Tag & Database Cleanup Plan",
      "Integration Security Review",
      "Funnel Performance Evaluation",
      "Prioritized Optimization Roadmap"
    ],
    images: [
      "https://assets.cdn.filesafe.space/P7WTdwLMsDsnEHkSqqXD/media/69994b303a2afd5d157f9140.png",
      "https://assets.cdn.filesafe.space/P7WTdwLMsDsnEHkSqqXD/media/69994a81df9bdf6ea183b340.png"
    ]
  }
};

const ServiceDetailsPage: React.FC = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const service = slug ? servicesData[slug] : null;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [slug]);

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] dark:bg-[#050505] text-[#1d1d1f] dark:text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Service Not Found</h2>
          <button 
            onClick={() => navigate('/')}
            className="text-purple-600 hover:underline flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" /> Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative pt-24 pb-32 px-6 transition-colors duration-300">
      <BackgroundGrid />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Navigation */}
        <div className="mb-12">
          <Link to="/#services" className="inline-flex items-center gap-2 text-sm font-medium text-[#424245] hover:text-[#1d1d1f] dark:text-gray-400 dark:hover:text-white transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Services
          </Link>
        </div>

        {/* Header */}
        <div className="max-w-5xl mx-auto mb-24">
          <div className="mb-12 animate-reveal-up">
            <div className={`w-16 h-16 rounded-2xl bg-${service.color}-50 dark:bg-${service.color}-900/20 text-${service.color}-600 dark:text-${service.color}-400 flex items-center justify-center border border-${service.color}-100 dark:border-${service.color}-800/30 mb-8`}>
              {service.icon}
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-[#1d1d1f] dark:text-white mb-4">
              {service.title}
            </h1>
            <p className="text-xl text-[#a855f7] font-medium tracking-wide">
              {service.subtitle}
            </p>
          </div>

          <div className="animate-reveal-up mb-16">
            <div className="columns-1 md:columns-2 gap-16 text-lg text-[#424245] dark:text-gray-300 leading-relaxed font-medium whitespace-pre-wrap">
              {service.description}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20 animate-reveal-up">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#1d1d1f] dark:text-white mb-6">
                What's Included
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {service.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className={`w-5 h-5 text-${service.color}-500 shrink-0 mt-0.5`} />
                    <span className="text-sm text-[#424245] dark:text-gray-400 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col justify-center items-start">
               <div className="p-6 rounded-[1.5rem] bg-gray-50 dark:bg-zinc-900/50 border border-gray-100 dark:border-white/5 mb-8 w-full backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <Layers className="w-5 h-5 text-[#424245] dark:text-gray-400" />
                    <h4 className="text-base font-bold text-[#1d1d1f] dark:text-white">Integration Ready</h4>
                  </div>
                  <p className="text-sm text-[#424245] dark:text-gray-400 font-medium leading-relaxed">
                    This service integrates seamlessly with your existing stack. We ensure data flows correctly between GoHighLevel and your other tools without friction.
                  </p>
               </div>
               <Magnetic>
                 <Link 
                   to="/submit" 
                   state={{ services: [service.title] }}
                   className={`inline-flex items-center gap-3 bg-[#1d1d1f] dark:bg-white text-white dark:text-black px-8 py-4 rounded-full text-base font-bold hover:bg-black dark:hover:bg-gray-200 transition-all shadow-lg hover:scale-105 active:scale-95`}
                 >
                   Book This Service <ArrowRight className="w-4 h-4" />
                 </Link>
               </Magnetic>
            </div>
          </div>

          {/* Visuals */}
          <div className="space-y-12 animate-reveal-up animation-delay-200">
            {service.images.map((img, idx) => (
              <div 
                key={idx} 
                className="group relative rounded-[2.5rem] overflow-hidden border border-gray-200 dark:border-white/10 shadow-2xl bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none" />
                
                {img.endsWith('.pdf') ? (
                  <iframe 
                    src={`${img}#toolbar=0&navpanes=0&scrollbar=0`}
                    title={`${service.title} Sample ${idx + 1}`}
                    className="w-full h-[600px] object-cover border-none"
                  />
                ) : (
                  <img 
                    src={img} 
                    alt={`${service.title} Sample ${idx + 1}`} 
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.01]"
                  />
                )}

                <div className="absolute bottom-6 left-6 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-2 group-hover:translate-y-0">
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-bold border border-white/30">
                    <Sparkles className="w-4 h-4" /> Sample Preview
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailsPage;