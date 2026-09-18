/* =========================================================
   CLOUD ENGINEER WORK SIMULATOR — TICKETS
   12 realistic support tickets (4 Beginner, 4 Intermediate,
   4 Advanced) that present a symptom and known evidence, then
   walk the learner through a sequence of diagnostic decisions
   before revealing the resolution — modeling the real
   troubleshooting flow the Networking Fundamentals and Azure
   Networking lessons teach, rather than jumping straight to
   an answer.

   Schema:
     id, ticketNumber, difficulty ("Beginner"|"Intermediate"|"Advanced"),
     domain (display label), title, reportedBy, scenario,
     evidence: [{ label, value }]  - known facts shown upfront
     steps: [{
       prompt,
       options: [{ label, correct, feedback }]
     }]
     resolution: {
       summary,
       whyOthersWrong: [string],
       skillsInvolved: [string],
     }
     relatedLessons: [lessonId, ...]  (for the "what this ticket
       practiced" call-out; not required to be clickable)
   ========================================================= */

const TICKETS = [
  // ---------------------------------------------------------
  // BEGINNER
  // ---------------------------------------------------------
  {
    id: "ticket-rdp-fail",
    ticketNumber: "1001",
    difficulty: "Beginner",
    domain: "Networking",
    title: "Can't RDP into VM-WEB01",
    reportedBy: "Help Desk",
    scenario: "An administrator reports they cannot RDP into VM-WEB01 from their office workstation. The VM shows as Running in the portal, and other admins on the same office network could RDP into it yesterday.",
    evidence: [
      { label: "VM power state", value: "Running" },
      { label: "VM private IP", value: "10.10.1.5" },
      { label: "VM public IP", value: "None (Bastion is available for this VNet)" },
      { label: "Admin's network", value: "Same office VNet, connected via Azure Bastion" },
      { label: "Recent change", value: "A teammate updated the VM's NSG this morning to \"tighten security\"" },
    ],
    steps: [
      {
        prompt: "What should you check first?",
        options: [
          { label: "The VM's NSG for an inbound rule allowing RDP (TCP 3389) from Bastion", correct: true, feedback: "Right instinct — a recent NSG change is the most likely suspect, and RDP over Bastion still needs to be allowed at the VM/subnet NSG." },
          { label: "The VM's disk space", correct: false, feedback: "Disk space wouldn't typically block an RDP connection attempt from succeeding or failing at the network level." },
          { label: "The office printer configuration", correct: false, feedback: "Unrelated to RDP connectivity for this VM." },
        ],
      },
      {
        prompt: "You check the NSG and find the recent change removed the rule allowing TCP 3389 from the Bastion subnet. What's the correct fix?",
        options: [
          { label: "Add an inbound NSG rule allowing TCP 3389 from the Bastion subnet range", correct: true, feedback: "Correct — Bastion needs the target NSG to explicitly allow RDP/SSH from the Bastion subnet." },
          { label: "Delete the NSG entirely", correct: false, feedback: "Removing the whole NSG eliminates all its protections, not just the one broken rule — too broad and risky." },
          { label: "Give the VM a public IP and open RDP to the internet", correct: false, feedback: "This exposes the VM directly to the internet, which is the opposite of the secure pattern Bastion exists to provide." },
        ],
      },
      {
        prompt: "After restoring the rule, RDP still fails once. What should you check next, since the NSG is now confirmed correct?",
        options: [
          { label: "Whether the Remote Desktop service is actually running on the VM, and confirm with a quick retry", correct: true, feedback: "With the network layer confirmed, checking the destination service itself (and simply retrying, since NSG changes can take a moment to apply) is the next logical step." },
          { label: "The office Wi-Fi password", correct: false, feedback: "The admin is already connected and reached Bastion; Wi-Fi isn't the blocker here." },
          { label: "The Azure subscription's billing status", correct: false, feedback: "Billing status doesn't affect a running VM's RDP connectivity." },
        ],
      },
    ],
    resolution: {
      summary: "The teammate's NSG \"cleanup\" had accidentally removed the rule allowing RDP from the Bastion subnet. Restoring that specific rule (rather than removing the whole NSG or exposing a public IP) fixed the issue while keeping the VM's security posture intact.",
      whyOthersWrong: [
        "Deleting the NSG removes every protection it provides, not just the broken rule — a much bigger security regression than the original problem.",
        "Adding a public IP with open RDP defeats the entire purpose of using Bastion for secure administrative access.",
      ],
      skillsInvolved: ["NSG rules", "Azure Bastion", "Least-privilege network changes", "Layered troubleshooting order"],
    },
    relatedLessons: ["network-nsg-asg", "network-secure-access", "netfund-firewalls-security"],
  },
  {
    id: "ticket-file-share-access",
    ticketNumber: "1002",
    difficulty: "Beginner",
    domain: "Storage",
    title: "Finance can't access their Azure file share",
    reportedBy: "Finance Department",
    scenario: "Finance reports they can no longer map the department's Azure Files share on their office PCs. It worked last week. IT confirms no one changed anything on the Finance PCs themselves.",
    evidence: [
      { label: "Storage account", value: "stfinanceprod (StorageV2, Standard)" },
      { label: "File share", value: "finance-docs" },
      { label: "Storage account networking", value: "Public network access: Disabled for all networks except a specific allowed IP range added last week by the security team" },
      { label: "Finance office public IP", value: "Not in the currently allowed range" },
    ],
    steps: [
      {
        prompt: "What should you check first, given the security team made a networking change last week?",
        options: [
          { label: "The storage account's network firewall / allowed IP ranges", correct: true, feedback: "Correct — a networking-level change is the most direct suspect given the timeline." },
          { label: "The file share's quota (storage size limit)", correct: false, feedback: "A quota issue would affect writing new data, not a fundamental inability to connect at all." },
          { label: "The Finance department's printer drivers", correct: false, feedback: "Unrelated to file share connectivity." },
        ],
      },
      {
        prompt: "You confirm the storage account firewall now only allows a specific IP range, and Finance's office public IP isn't in it. What's the best fix?",
        options: [
          { label: "Add Finance's actual office public IP range to the storage account's allowed list", correct: true, feedback: "Correct — this restores access with the same least-privilege networking approach the security team intended." },
          { label: "Disable the storage firewall entirely and allow all networks", correct: false, feedback: "This undoes the security team's intended protection for the whole storage account, not just Finance's access." },
          { label: "Share the storage account key with all of Finance so they can bypass the firewall", correct: false, feedback: "A storage account key does not bypass network firewall rules, and distributing it broadly is a serious security risk regardless." },
        ],
      },
      {
        prompt: "Finance can now connect. What should you communicate back to the security team?",
        options: [
          { label: "The office's public IP range should be documented and included in any future network firewall changes", correct: true, feedback: "Correct — closing the communication loop prevents this exact issue from recurring with the next change." },
          { label: "Nothing — the ticket is closed once Finance can connect", correct: false, feedback: "Without feedback to the team that made the change, the same gap in their process could easily repeat." },
        ],
      },
    ],
    resolution: {
      summary: "A security-driven storage firewall change unintentionally excluded Finance's office IP range. Adding the correct range restored access without reopening the account to all networks — the fix matched the same least-privilege intent as the original change.",
      whyOthersWrong: [
        "Disabling the firewall entirely reverses the security team's intended protection for everyone, not just Finance.",
        "Sharing the storage account key doesn't even solve the problem, since account keys don't bypass network firewall rules — and it creates a separate, serious credential-exposure risk.",
      ],
      skillsInvolved: ["Storage account networking", "Least-privilege network changes", "Cross-team communication"],
    },
    relatedLessons: ["storage-network-identity", "netfund-firewalls-security"],
  },
  {
    id: "ticket-app-unavailable",
    ticketNumber: "1003",
    difficulty: "Beginner",
    domain: "Monitoring",
    title: "VM is running, but the app monitor says it's down",
    reportedBy: "Automated Monitoring Alert",
    scenario: "An alert fires: \"Application unavailable on vm-app-03.\" You check the Azure portal and the VM shows Running with normal CPU and memory usage.",
    evidence: [
      { label: "VM power state", value: "Running" },
      { label: "VM CPU / memory", value: "Normal (under 30%)" },
      { label: "Alert source", value: "An HTTP availability test hitting the app on port 8080" },
      { label: "Last deployment", value: "A new app version was deployed 20 minutes ago" },
    ],
    steps: [
      {
        prompt: "The VM itself looks healthy. What does that tell you, and what should you check next?",
        options: [
          { label: "A healthy VM doesn't mean the application process on it is healthy — check whether the app is actually running and listening on port 8080", correct: true, feedback: "Correct — VM health and application health are two separate layers, and the recent deployment is a strong lead." },
          { label: "The alert must be a false positive with no further investigation needed", correct: false, feedback: "Dismissing an alert without investigation risks missing a real, ongoing outage." },
          { label: "The VM should be immediately restarted", correct: false, feedback: "Restarting first, before understanding the cause, could lose diagnostic information and doesn't address a likely application-level issue from the recent deployment." },
        ],
      },
      {
        prompt: "You check the app logs and find it crashed on startup after the new deployment, due to a configuration error. What's the appropriate immediate action?",
        options: [
          { label: "Roll back to the previous known-good deployment while the configuration issue is fixed", correct: true, feedback: "Correct — restoring service quickly, then fixing the root cause afterward, is the standard incident-response approach." },
          { label: "Leave the broken version running while debugging in production", correct: false, feedback: "This extends the outage unnecessarily when a known-good rollback is available." },
          { label: "Delete the VM and recreate it from scratch", correct: false, feedback: "This is a drastic, unnecessary step for an application-configuration problem, not a VM-level failure." },
        ],
      },
      {
        prompt: "After rolling back, the app monitor shows healthy again. What should happen before the next deployment attempt?",
        options: [
          { label: "Fix and validate the configuration issue in a lower environment before redeploying to production", correct: true, feedback: "Correct — validating the fix outside production reduces the risk of repeating the same outage." },
          { label: "Redeploy the same broken version immediately", correct: false, feedback: "Redeploying the same broken configuration would just recreate the outage." },
        ],
      },
    ],
    resolution: {
      summary: "The VM itself was healthy, but the newly deployed application crashed on startup due to a bad configuration value. Rolling back restored service quickly; the configuration issue was then fixed and validated in a lower environment before being redeployed.",
      whyOthersWrong: [
        "Dismissing the alert as a false positive without checking would have left a real outage unaddressed.",
        "Restarting the VM or recreating it doesn't address an application-configuration problem, and risks losing useful diagnostic information.",
      ],
      skillsInvolved: ["Distinguishing infrastructure health from application health", "Incident response (rollback first, root-cause after)", "Safe deployment practices"],
    },
    relatedLessons: ["monitor-metrics-logs", "compute-appservice-config"],
  },
  {
    id: "ticket-new-employee-portal-access",
    ticketNumber: "1004",
    difficulty: "Beginner",
    domain: "Identity",
    title: "New employee can't sign in to the Azure portal",
    reportedBy: "New Hire's Manager",
    scenario: "A new employee's Microsoft Entra account was created yesterday. They report they can sign in to Microsoft 365 email fine, but get \"You do not have permission\" when trying to view anything in the Azure portal.",
    evidence: [
      { label: "Account type", value: "Member (created yesterday)" },
      { label: "Microsoft 365 license", value: "Assigned" },
      { label: "Azure RBAC role assignments for this user", value: "None found" },
      { label: "Manager's request", value: "\"They need to be able to view our team's resource group.\"" },
    ],
    steps: [
      {
        prompt: "The account exists and has a Microsoft 365 license, but still can't view Azure resources. What's the most likely cause?",
        options: [
          { label: "The user has no Azure RBAC role assignment yet", correct: true, feedback: "Correct — a Microsoft 365 license enables product features but grants no Azure resource permissions by itself." },
          { label: "The user's password must be wrong", correct: false, feedback: "A wrong password would prevent sign-in entirely, not produce a permissions error after successfully signing in." },
          { label: "Azure and Microsoft 365 always share the exact same permissions automatically", correct: false, feedback: "This is incorrect — licensing and Azure RBAC are separate, independent controls." },
        ],
      },
      {
        prompt: "The manager wants the new employee to view (but not change) resources in the team's resource group. What should you assign?",
        options: [
          { label: "The Reader role, scoped to that specific resource group", correct: true, feedback: "Correct — Reader grants view-only access, and scoping it to the specific resource group follows least privilege." },
          { label: "The Owner role, scoped to the entire subscription", correct: false, feedback: "This grants far more access (including changing and deleting resources subscription-wide) than the stated \"view only, one resource group\" need." },
          { label: "The Contributor role, scoped to the management group", correct: false, feedback: "Contributor allows changes, not just viewing, and management-group scope is broader than the one resource group requested." },
        ],
      },
      {
        prompt: "After assigning Reader at the resource group, the employee still can't see it immediately. What's a reasonable next step before assuming something is broken?",
        options: [
          { label: "Have them sign out and back in, since role assignment changes can take a few minutes to take effect", correct: true, feedback: "Correct — role assignments can take a short time to propagate, and a fresh sign-in often resolves an immediate check." },
          { label: "Immediately escalate as a platform-wide outage", correct: false, feedback: "A brief propagation delay is normal and doesn't indicate a platform-wide problem." },
        ],
      },
    ],
    resolution: {
      summary: "The new employee had a Microsoft 365 license but no Azure RBAC role assignment — two separate controls. Assigning Reader at the specific resource group (not Owner at the subscription) gave exactly the requested view-only access at the correct scope.",
      whyOthersWrong: [
        "Owner at the subscription would grant far more access than requested, including the ability to change or delete resources subscription-wide.",
        "Contributor at the management group scope both allows changes (not just viewing) and applies far more broadly than the one resource group the manager asked about.",
      ],
      skillsInvolved: ["Licensing vs Azure RBAC", "Least-privilege role assignment", "RBAC scope selection"],
    },
    relatedLessons: ["identity-licenses-external-sspr", "identity-rbac"],
  },

  // ---------------------------------------------------------
  // INTERMEDIATE
  // ---------------------------------------------------------
  {
    id: "ticket-readonly-storage-access",
    ticketNumber: "1005",
    difficulty: "Intermediate",
    domain: "Identity",
    title: "Developer needs read-only Storage Account access",
    reportedBy: "Development Team Lead",
    scenario: "A developer needs to read blobs in a production storage account to debug an issue, but must not be able to modify or delete anything — production data must remain untouched.",
    evidence: [
      { label: "Storage account", value: "stappprodeastus2 (contains multiple containers)" },
      { label: "Developer's current access", value: "None on this storage account" },
      { label: "Requirement", value: "Read blob data only, no management-plane changes, no write/delete" },
    ],
    steps: [
      {
        prompt: "What kind of role does the developer actually need — management-plane or data-plane?",
        options: [
          { label: "A data-plane role, since they need to read the actual blob content", correct: true, feedback: "Correct — reading blob data is a data-plane operation, distinct from managing the storage account's settings." },
          { label: "A management-plane role, since Contributor can do anything", correct: false, feedback: "Contributor is a management-plane role and does not, by itself, grant blob data read access." },
        ],
      },
      {
        prompt: "Which specific role matches \"read blob data only, no write or delete\"?",
        options: [
          { label: "Storage Blob Data Reader", correct: true, feedback: "Correct — this role grants exactly read access to blob data." },
          { label: "Storage Blob Data Contributor", correct: false, feedback: "Data Contributor includes write and delete permissions, more than the stated read-only requirement." },
          { label: "Owner", correct: false, feedback: "Owner grants full control over the entire resource, far beyond read-only blob access." },
        ],
      },
      {
        prompt: "What scope should the role assignment use?",
        options: [
          { label: "The specific storage account only", correct: true, feedback: "Correct — this matches the requirement without granting access to unrelated resources." },
          { label: "The entire subscription", correct: false, feedback: "This grants access far beyond the one storage account the developer actually needs." },
        ],
      },
    ],
    resolution: {
      summary: "The developer was granted Storage Blob Data Reader scoped to just the one storage account — a data-plane role providing exactly the read access requested, without any write, delete, or management-plane permissions, and without unnecessary subscription-wide scope.",
      whyOthersWrong: [
        "Contributor is a management-plane role and doesn't include RBAC-based blob data read access by itself, while also being broader than a read-only need.",
        "Storage Blob Data Contributor and Owner both grant more than read-only access, violating the stated requirement.",
        "Subscription-wide scope would expose every other storage account and resource in the subscription, not just the one requested.",
      ],
      skillsInvolved: ["Management-plane vs data-plane permissions", "Storage Blob Data Reader", "Least-privilege scope selection"],
    },
    relatedLessons: ["storage-network-identity", "identity-rbac"],
  },
  {
    id: "ticket-private-dns-resolution",
    ticketNumber: "1006",
    difficulty: "Intermediate",
    domain: "Networking",
    title: "On-premises users can't resolve an Azure app's private hostname",
    reportedBy: "Office IT Coordinator",
    scenario: "An internal web app is hosted behind a private endpoint in Azure, reachable by name from inside the VNet. Employees connecting from the on-premises office (via site-to-site VPN) get \"server not found\" when trying the same hostname.",
    evidence: [
      { label: "Private endpoint", value: "Configured and working correctly for VNet-based clients" },
      { label: "Private DNS zone", value: "Linked to the Azure VNet, resolves correctly from VMs inside the VNet" },
      { label: "On-premises DNS", value: "Office PCs use an on-premises DNS server for name resolution, not Azure DNS directly" },
      { label: "VPN connectivity", value: "Site-to-site VPN shows Connected; on-premises devices can already reach other Azure private IPs directly" },
    ],
    steps: [
      {
        prompt: "VPN connectivity works and DNS works fine for VNet-based clients. What's the most likely gap?",
        options: [
          { label: "The on-premises DNS server has no way to resolve the private DNS zone's records", correct: true, feedback: "Correct — a Private DNS zone linked only to the VNet has no path for an entirely separate on-premises DNS server to query it." },
          { label: "The VPN tunnel must be down, since DNS is failing", correct: false, feedback: "The evidence explicitly shows the VPN is connected and other private IP traffic already works." },
          { label: "The private endpoint itself must be misconfigured", correct: false, feedback: "The evidence shows the private endpoint works correctly for VNet-based clients, so the endpoint itself isn't the problem." },
        ],
      },
      {
        prompt: "What is a standard way to let on-premises DNS resolve an Azure Private DNS zone's records?",
        options: [
          { label: "Set up DNS forwarding from on-premises DNS to an Azure-hosted DNS forwarder (e.g., a VM or Azure DNS Private Resolver) that can query the private zone", correct: true, feedback: "Correct — this is the standard hybrid DNS pattern for extending private name resolution to on-premises clients." },
          { label: "Have every on-premises employee edit their computer's hosts file manually", correct: false, feedback: "This doesn't scale and isn't a maintainable fix for an organization-wide need." },
          { label: "Make the private endpoint public instead", correct: false, feedback: "This defeats the entire purpose of using a private endpoint in the first place." },
        ],
      },
      {
        prompt: "After setting up DNS forwarding, what should you verify to confirm the fix worked?",
        options: [
          { label: "That an on-premises PC can now resolve the hostname to the private endpoint's IP address, and successfully connect", correct: true, feedback: "Correct — confirming both name resolution and actual connectivity proves the full fix." },
          { label: "That the VPN tunnel status still says Connected", correct: false, feedback: "The VPN was already confirmed connected before the fix — that alone doesn't validate the DNS resolution fix." },
        ],
      },
    ],
    resolution: {
      summary: "The Private DNS zone was correctly linked to the Azure VNet, but on-premises clients use a separate, on-premises DNS server that had no path to query Azure's private DNS records. Setting up DNS forwarding from on-premises DNS toward an Azure-side resolver fixed name resolution for on-premises clients without changing the private endpoint at all.",
      whyOthersWrong: [
        "The VPN itself was confirmed working (other private IP traffic already succeeded), so it was never the actual blocker.",
        "The private endpoint was already proven to work for VNet-based clients, ruling it out as the root cause.",
        "Making the endpoint public would solve the symptom by removing the security control the private endpoint was specifically there to provide.",
      ],
      skillsInvolved: ["Private DNS zones", "Hybrid networking", "Private endpoints", "DNS troubleshooting"],
    },
    relatedLessons: ["network-secure-access", "netfund-vpn-private-connectivity", "netfund-core-services"],
  },
  {
    id: "ticket-remove-public-exposure",
    ticketNumber: "1007",
    difficulty: "Intermediate",
    domain: "Networking",
    title: "Security wants a VM no longer directly exposed to the internet",
    reportedBy: "Security Team",
    scenario: "A security review flagged vm-legacy-01 as having a public IP with RDP open directly to the internet. Security wants this remediated without breaking the two administrators who currently rely on RDP access.",
    evidence: [
      { label: "Current config", value: "Public IP attached to the VM; NSG allows inbound TCP 3389 from Any" },
      { label: "Admin usage", value: "Two administrators RDP into this VM roughly weekly" },
      { label: "VNet", value: "vm-legacy-01 is in vnet-legacy, which has no AzureBastionSubnet yet" },
    ],
    steps: [
      {
        prompt: "What is the core problem security flagged?",
        options: [
          { label: "RDP (TCP 3389) is open to the entire internet (Any), not restricted to a safe, known source", correct: true, feedback: "Correct — 'Any' source for RDP is a classic high-risk exposure security teams specifically look for." },
          { label: "The VM is running an outdated operating system", correct: false, feedback: "This wasn't mentioned in the evidence and isn't what was flagged." },
          { label: "The VM has too much CPU allocated", correct: false, feedback: "VM sizing is unrelated to the security exposure that was flagged." },
        ],
      },
      {
        prompt: "What is the best remediation that removes the public exposure while preserving the two admins' access?",
        options: [
          { label: "Deploy Azure Bastion into the VNet (creating the required subnet), remove the VM's public IP, and remove the broad inbound NSG rule", correct: true, feedback: "Correct — Bastion provides secure RDP without a public IP on the VM, addressing the flagged risk directly." },
          { label: "Just narrow the NSG rule's source to the office IP range, but keep the public IP", correct: false, feedback: "This reduces but doesn't eliminate the exposure security asked to remove — the VM still has a public IP and an internet-facing listener." },
          { label: "Do nothing, since only two admins use it", correct: false, feedback: "Low usage doesn't reduce the actual risk of an internet-exposed RDP port; the security team's finding still needs remediation." },
        ],
      },
      {
        prompt: "After deploying Bastion and removing the public IP, what should you confirm before closing the ticket?",
        options: [
          { label: "Both administrators can still successfully connect via Bastion, and the public IP/broad NSG rule are fully removed", correct: true, feedback: "Correct — validating both the fix and that admin access still works is the responsible way to close this out." },
          { label: "Only that the public IP was removed, without testing admin access", correct: false, feedback: "Without confirming the admins can still connect, you risk trading one incident (security exposure) for another (locked-out administrators)." },
        ],
      },
    ],
    resolution: {
      summary: "The VM's public IP and broad NSG rule allowing RDP from the entire internet were the flagged exposure. Deploying Azure Bastion into the VNet, then removing the public IP and the broad NSG rule, eliminated the internet exposure while preserving secure RDP access for the two administrators through Bastion.",
      whyOthersWrong: [
        "Narrowing the NSG source to an office IP range reduces risk but doesn't fully address the finding, since the VM still has a public IP and an internet-facing RDP listener.",
        "Leaving the configuration unchanged ignores the security team's finding regardless of how few people use the access.",
      ],
      skillsInvolved: ["Azure Bastion", "NSG remediation", "Balancing security fixes with operational continuity"],
    },
    relatedLessons: ["network-secure-access", "network-nsg-asg"],
  },
  {
    id: "ticket-spoke-to-spoke",
    ticketNumber: "1008",
    difficulty: "Intermediate",
    domain: "Networking",
    title: "Two VMs in peered spoke VNets can't communicate",
    reportedBy: "Application Team",
    scenario: "vnet-app and vnet-data are both peered to a central vnet-hub (hub-and-spoke design), and each spoke's peering to the hub shows Connected. A VM in vnet-app cannot reach a VM in vnet-data, even though both can reach resources inside the hub itself.",
    evidence: [
      { label: "vnet-app to vnet-hub peering", value: "Connected" },
      { label: "vnet-data to vnet-hub peering", value: "Connected" },
      { label: "vnet-app to vnet-data peering", value: "Does not exist — no direct peering between the two spokes" },
      { label: "Hub VNet", value: "Contains a network virtual appliance (firewall) intended to inspect spoke-to-spoke traffic" },
    ],
    steps: [
      {
        prompt: "Both spokes can reach the hub, but not each other. What concept explains this?",
        options: [
          { label: "VNet peering is not transitive — being peered to a common hub doesn't automatically connect the two spokes to each other", correct: true, feedback: "Correct — this is the classic hub-and-spoke gotcha: A-to-B and B-to-C peering does not create A-to-C connectivity automatically." },
          { label: "NSGs must be completely blocking all traffic between the spokes", correct: false, feedback: "The evidence doesn't point to NSGs; the described topology explains the symptom without needing an NSG assumption." },
          { label: "The VMs must have incorrect IP addresses", correct: false, feedback: "Nothing in the evidence suggests an addressing problem — both spokes reach the hub fine." },
        ],
      },
      {
        prompt: "Given the hub contains a firewall appliance meant to inspect spoke-to-spoke traffic, what's the correct fix?",
        options: [
          { label: "Add a user-defined route (UDR) in each spoke's subnet sending the other spoke's address range to the hub firewall appliance as next hop", correct: true, feedback: "Correct — this routes spoke-to-spoke traffic through the hub appliance as intended, working around peering's non-transitive nature." },
          { label: "Create a direct peering between vnet-app and vnet-data instead", correct: false, feedback: "This would technically connect them, but it bypasses the hub firewall appliance the design specifically intended for inspecting this traffic." },
          { label: "Delete both spokes' peering to the hub", correct: false, feedback: "This would break each spoke's connectivity to the hub entirely, making the situation worse, not better." },
        ],
      },
      {
        prompt: "After adding the UDRs, how should you validate the fix?",
        options: [
          { label: "Confirm traffic between the two spoke VMs now succeeds and is actually passing through the hub firewall (check its logs)", correct: true, feedback: "Correct — validating both connectivity and that it's taking the intended inspected path confirms the design goal was met, not just papered over." },
          { label: "Confirm only that the peering status still says Connected", correct: false, feedback: "Peering status was never the issue — it was already Connected before and after; this doesn't confirm the actual fix." },
        ],
      },
    ],
    resolution: {
      summary: "VNet peering is not transitive: both spokes reaching the hub did not mean the spokes could reach each other. Adding a user-defined route in each spoke, directing the other spoke's address range through the hub's firewall appliance, restored connectivity through the intended inspection point — without bypassing the firewall by peering the spokes directly.",
      whyOthersWrong: [
        "Peering the two spokes directly would fix connectivity but bypass the hub firewall appliance the architecture specifically placed in the path for inspection.",
        "Removing the existing hub peerings would break each spoke's connectivity to the hub, making the overall situation worse.",
      ],
      skillsInvolved: ["VNet peering transitivity", "User-defined routes", "Hub-and-spoke network design"],
    },
    relatedLessons: ["network-peering-public-route", "netfund-routing"],
  },

  // ---------------------------------------------------------
  // ADVANCED
  // ---------------------------------------------------------
  {
    id: "ticket-lb-probe-failing",
    ticketNumber: "1009",
    difficulty: "Advanced",
    domain: "Networking",
    title: "Load balancer intermittently sends users to a failing backend",
    reportedBy: "Customer Support (user complaints)",
    scenario: "Users intermittently report errors on a web app behind an Azure Load Balancer with three backend VMs. All three VMs show Running and normal CPU, but one is repeatedly cycling in and out of the healthy backend pool.",
    evidence: [
      { label: "Backend pool", value: "3 VMs, app listens on TCP 8080" },
      { label: "Health probe configuration", value: "HTTP probe on port 80, path /" },
      { label: "App configuration", value: "The application only listens on port 8080, not port 80" },
      { label: "VM resource usage", value: "Normal on all three VMs" },
    ],
    steps: [
      {
        prompt: "All VMs look healthy at the OS level, but one keeps failing the load balancer's health check. What should you compare?",
        options: [
          { label: "The health probe's configured port/path versus the port the application actually listens on", correct: true, feedback: "Correct — a probe checking the wrong port will fail regardless of the application's actual health." },
          { label: "The VM's Azure region", correct: false, feedback: "All backend VMs are presumably in the same region already; this wasn't flagged as different." },
          { label: "The load balancer's SKU name", correct: false, feedback: "SKU naming doesn't explain an intermittent single-backend health failure pattern." },
        ],
      },
      {
        prompt: "You find the probe checks port 80, but the app only listens on 8080. Why would this cause an *intermittent* failure on only one VM instead of constant failure on all three?",
        options: [
          { label: "The other two VMs likely have a separate lightweight service or default response on port 80 that happens to satisfy the probe, while this one VM does not", correct: true, feedback: "Correct reasoning — an inconsistent probe target across backends can produce exactly this uneven, confusing symptom pattern." },
          { label: "Health probes only check one random backend per hour", correct: false, feedback: "This is not how Azure Load Balancer health probes work — they check all backend instances continuously." },
          { label: "The affected VM must have a hardware fault", correct: false, feedback: "Nothing in the evidence points to a hardware issue; the probe/port mismatch is a sufficient and simpler explanation." },
        ],
      },
      {
        prompt: "What is the correct fix?",
        options: [
          { label: "Reconfigure the health probe to target TCP/HTTP port 8080, matching the application's actual listening port", correct: true, feedback: "Correct — aligning the probe with the real application port ensures health is judged accurately and consistently." },
          { label: "Remove health probes entirely so no backend is ever marked unhealthy", correct: false, feedback: "This would let traffic reach genuinely broken backends with no protection at all — the opposite of what health probes are for." },
          { label: "Restart all three VMs", correct: false, feedback: "Restarting doesn't fix a configuration mismatch between the probe's port and the application's actual port." },
        ],
      },
      {
        prompt: "After fixing the probe, how do you confirm the issue is fully resolved?",
        options: [
          { label: "Monitor the backend pool's health status over time and confirm user error reports stop", correct: true, feedback: "Correct — confirming both the technical health status and the actual user-facing symptom validates the fix." },
          { label: "Confirm the fix by checking the probe's configuration screen once, with no further monitoring", correct: false, feedback: "A one-time configuration check doesn't confirm the intermittent, real-world symptom has actually stopped." },
        ],
      },
    ],
    resolution: {
      summary: "The health probe was checking port 80, but the application only listened on port 8080 — a mismatch that produced inconsistent, confusing results across backends depending on what (if anything) responded on port 80 for each VM. Correcting the probe to target port 8080 aligned health checking with the application's real listening port and resolved the intermittent errors.",
      whyOthersWrong: [
        "Removing health probes entirely eliminates the load balancer's ability to protect users from any genuinely unhealthy backend — a much worse outcome than the original intermittent issue.",
        "Restarting the VMs doesn't address a configuration mismatch between the probe and the application's actual port.",
      ],
      skillsInvolved: ["Load balancer health probes", "Layer 4 troubleshooting", "Root-cause vs symptom-level fixes"],
    },
    relatedLessons: ["network-dns-loadbalancer"],
  },
  {
    id: "ticket-vpn-connected-no-traffic",
    ticketNumber: "1010",
    difficulty: "Advanced",
    domain: "Networking",
    title: "Site-to-Site VPN shows Connected, but no traffic passes",
    reportedBy: "Network Operations",
    scenario: "The site-to-site VPN Gateway connection between the office and an Azure VNet shows a status of Connected, but on-premises servers cannot reach any Azure VM, and Azure VMs cannot reach any on-premises server.",
    evidence: [
      { label: "VPN Gateway connection status", value: "Connected" },
      { label: "Azure VNet address space", value: "10.20.0.0/16" },
      { label: "On-premises network address space", value: "10.20.0.0/16 (identical to the Azure VNet)" },
      { label: "Gateway subnet", value: "Present and correctly sized" },
    ],
    steps: [
      {
        prompt: "The tunnel itself shows Connected, yet no traffic flows in either direction. What stands out most in the evidence?",
        options: [
          { label: "The on-premises network and the Azure VNet use the exact same address space (10.20.0.0/16)", correct: true, feedback: "Correct — this is the standout red flag. Overlapping address spaces make routing between the two networks fundamentally ambiguous." },
          { label: "The gateway subnet is present and correctly sized", correct: false, feedback: "This detail is confirmed fine in the evidence, not the problem." },
          { label: "The connection shows Connected at all", correct: false, feedback: "A Connected tunnel status is actually expected and correct here — the problem lies elsewhere, in what that tunnel is trying to route." },
        ],
      },
      {
        prompt: "Why does an overlapping address space break connectivity even when the tunnel itself is up?",
        options: [
          { label: "Devices can't tell whether an address like 10.20.5.10 refers to something on-premises or in Azure, so routing can't work correctly", correct: true, feedback: "Correct — unambiguous routing requires non-overlapping address spaces on both sides of the connection." },
          { label: "Overlapping address spaces always disable the VPN tunnel automatically", correct: false, feedback: "The evidence shows the tunnel status as Connected — the overlap doesn't disable the tunnel itself, it breaks the routing over it." },
          { label: "This has no real effect and must be a coincidence unrelated to the outage", correct: false, feedback: "Address overlap between two networks meant to be connected is a well-known, direct cause of exactly this kind of failure." },
        ],
      },
      {
        prompt: "What is the correct remediation?",
        options: [
          { label: "Re-address one of the two networks (commonly the Azure VNet, if it's newer/smaller in scope) to a non-overlapping range, then update routing accordingly", correct: true, feedback: "Correct — eliminating the overlap is the only real fix; everything else is a workaround at best." },
          { label: "Restart the VPN Gateway", correct: false, feedback: "Restarting doesn't change either network's address space, so the fundamental conflict remains." },
          { label: "Increase the VPN Gateway's SKU size", correct: false, feedback: "A larger gateway SKU affects throughput/features, not an address-space conflict." },
        ],
      },
      {
        prompt: "Before finalizing a re-addressing plan, what should you double-check?",
        options: [
          { label: "That the new address range doesn't overlap with any other connected network the organization already has (other VNets, other offices)", correct: true, feedback: "Correct — solving one overlap while creating a new one elsewhere would just relocate the same problem." },
          { label: "That the new address range is smaller than the original, regardless of future growth", correct: false, feedback: "Sizing should be based on actual host and growth needs (from the subnetting lessons), not simply making it smaller than before." },
        ],
      },
    ],
    resolution: {
      summary: "The on-premises network and the Azure VNet were assigned the identical address space (10.20.0.0/16). Even with the VPN tunnel itself up and reporting Connected, this made routing between the two networks fundamentally ambiguous. The environments had to be re-addressed to non-overlapping ranges before connectivity could actually work.",
      whyOthersWrong: [
        "Restarting the gateway or increasing its SKU size addresses neither network's addressing conflict — the tunnel already works; what it's carrying doesn't route correctly.",
        "A Connected tunnel status is a red herring here — connectivity failures with overlapping address spaces happen despite, not because of, tunnel status.",
      ],
      skillsInvolved: ["VPN Gateway", "Address space planning", "Recognizing overlap as a routing failure, not a tunnel failure"],
    },
    relatedLessons: ["netfund-vpn-private-connectivity", "netfund-cidr-subnetting-1", "network-vnet-subnet"],
  },
  {
    id: "ticket-private-endpoint-still-public",
    ticketNumber: "1011",
    difficulty: "Advanced",
    domain: "Storage",
    title: "App still uses the public endpoint despite a private endpoint being configured",
    reportedBy: "Application Team",
    scenario: "A private endpoint was configured for a storage account so an app inside the VNet would reach it privately. Network Watcher packet capture shows the app's traffic is still going out to the storage account's public IP address instead of the private endpoint's private IP.",
    evidence: [
      { label: "Private endpoint", value: "Created and shows status Approved" },
      { label: "Private DNS zone", value: "privatelink.blob.core.windows.net zone exists but is not linked to the app's VNet" },
      { label: "App's DNS resolution", value: "Resolves the storage account's hostname to its public IP address" },
      { label: "Storage account public network access", value: "Currently still enabled" },
    ],
    steps: [
      {
        prompt: "The private endpoint itself was created successfully. Why might the app still be resolving to the public IP?",
        options: [
          { label: "The required private DNS zone isn't linked to the app's VNet, so name resolution still returns the public IP instead of the private endpoint's IP", correct: true, feedback: "Correct — a private endpoint alone doesn't change DNS resolution; the matching private DNS zone must be linked to the VNet for clients to actually resolve to the private IP." },
          { label: "Private endpoints never actually change DNS resolution under any circumstances", correct: false, feedback: "This is incorrect — with correct DNS zone linkage, clients do resolve to the private endpoint's IP; the linkage is exactly what's currently missing." },
          { label: "The app must be misconfigured with a hardcoded public IP", correct: false, feedback: "The evidence shows this is a DNS resolution problem, not a hardcoded address in the app." },
        ],
      },
      {
        prompt: "What is the correct fix for the DNS resolution?",
        options: [
          { label: "Link the privatelink.blob.core.windows.net private DNS zone to the app's VNet (and ensure it has the correct record for the storage account)", correct: true, feedback: "Correct — linking the zone lets clients in that VNet resolve the storage account's name to the private endpoint's IP." },
          { label: "Change the app's code to use a hardcoded IP address instead of the hostname", correct: false, feedback: "Hardcoding IPs is fragile and bypasses DNS entirely rather than fixing the actual resolution gap." },
          { label: "Delete the private endpoint and start over from scratch", correct: false, feedback: "The private endpoint itself was already correctly created and approved — the missing piece is DNS zone linkage, not the endpoint." },
        ],
      },
      {
        prompt: "After linking the DNS zone, the app now resolves to the private IP successfully. What should you consider next as a security follow-up?",
        options: [
          { label: "Disable the storage account's public network access, now that private connectivity is confirmed working", correct: true, feedback: "Correct — leaving public access enabled after private connectivity is proven working leaves an unnecessary exposure open." },
          { label: "Nothing further is needed once DNS resolves correctly", correct: false, feedback: "Public network access being left enabled is a real residual exposure worth closing once private access is confirmed working." },
        ],
      },
    ],
    resolution: {
      summary: "The private endpoint was correctly created, but its matching private DNS zone was never linked to the app's VNet, so name resolution kept returning the storage account's public IP. Linking the DNS zone fixed resolution to the private IP; disabling public network access afterward closed the remaining exposure now that private connectivity was confirmed.",
      whyOthersWrong: [
        "Hardcoding an IP address in the application bypasses DNS rather than fixing the actual configuration gap, and creates a fragile, hard-to-maintain dependency.",
        "Recreating the private endpoint from scratch wastes effort on a component that was already working correctly — the gap was in DNS zone linkage, not the endpoint itself.",
      ],
      skillsInvolved: ["Private endpoints", "Private DNS zones", "Network reachability vs. DNS resolution", "Defense-in-depth (closing public access after validating the private path)"],
    },
    relatedLessons: ["storage-network-identity", "network-secure-access"],
  },
  {
    id: "ticket-intermittent-app-db",
    ticketNumber: "1012",
    difficulty: "Advanced",
    domain: "Monitoring",
    title: "Intermittent, hard-to-reproduce app-to-database connectivity failures",
    reportedBy: "Application Team",
    scenario: "The app team reports occasional connection timeouts between the app tier and a database VM, roughly a few times a day at unpredictable times. A manual connectivity test run right after each report always succeeds, showing nothing wrong.",
    evidence: [
      { label: "Manual test results", value: "Always succeeds when run immediately after a reported failure" },
      { label: "NSG rules", value: "Reviewed, appear correct and unchanged recently" },
      { label: "Route tables", value: "Reviewed, appear correct and unchanged recently" },
      { label: "Available tooling", value: "Network Watcher is available but not yet configured for ongoing monitoring of this path" },
    ],
    steps: [
      {
        prompt: "A one-time manual test never reproduces the issue. What kind of tool is actually needed here?",
        options: [
          { label: "A continuous monitoring tool that observes the connection over time, rather than a single point-in-time test", correct: true, feedback: "Correct — an intermittent problem needs a tool that watches continuously, since a single test can easily miss the failure window." },
          { label: "A one-time NSG rule review is sufficient and no further tooling is needed", correct: false, feedback: "NSG rules were already reviewed and found unchanged/correct — the issue clearly requires a different kind of investigation." },
          { label: "Nothing further can be done since the issue can't be reproduced on demand", correct: false, feedback: "Intermittent issues are still diagnosable — they just require observation over time rather than a single manual test." },
        ],
      },
      {
        prompt: "Which Network Watcher capability fits this exact need?",
        options: [
          { label: "Connection Monitor", correct: true, feedback: "Correct — Connection Monitor is specifically designed for continuous connectivity observation over time." },
          { label: "IP flow verify", correct: false, feedback: "IP flow verify is a one-time, point-in-time test — the same limitation as the manual tests already tried." },
          { label: "Next hop", correct: false, feedback: "Next hop identifies routing behavior for a single test, not ongoing connectivity monitoring." },
        ],
      },
      {
        prompt: "After running Connection Monitor for a few days, it captures several failure windows correlating with a nightly batch job on a shared network path. What should happen next?",
        options: [
          { label: "Investigate the batch job's network impact (e.g., bandwidth saturation) as the likely root cause, using the correlated timing as the lead", correct: true, feedback: "Correct — the timing correlation gives a concrete, testable lead to pursue instead of continuing to guess." },
          { label: "Ignore the correlation, since it might be a coincidence", correct: false, feedback: "A repeated correlation across multiple captured failure windows is a strong, worthwhile lead, not something to dismiss without investigation." },
          { label: "Immediately rebuild the entire network from scratch", correct: false, feedback: "This is a drastic, unfocused action when a specific, testable lead has already been identified." },
        ],
      },
    ],
    resolution: {
      summary: "A single manual connectivity test could never catch an intermittent failure, since it only checks one moment in time. Configuring Connection Monitor to continuously observe the app-to-database path captured multiple failure windows, which correlated with a nightly batch job saturating a shared network path — giving the team a concrete, testable root cause instead of continuing to guess.",
      whyOthersWrong: [
        "NSG and route table reviews were already done and came back clean — repeating one-time checks wasn't going to catch an intermittent issue they'd already ruled out.",
        "Declaring the issue undiagnosable, or jumping to a full network rebuild, both skip the actual right tool for this exact problem: continuous observation over time.",
      ],
      skillsInvolved: ["Network Watcher Connection Monitor", "Diagnosing intermittent issues", "Correlating evidence to find root cause"],
    },
    relatedLessons: ["monitor-insights-networkwatcher", "network-troubleshooting"],
  },
];
