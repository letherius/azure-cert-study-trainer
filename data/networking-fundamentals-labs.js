/* =========================================================
   NETWORKING FUNDAMENTALS TRACK — LABS
   3 vendor-neutral, non-Azure labs practicing subnet math,
   packet-path reasoning, and troubleshooting order. Uses the
   same lab schema as data/labs.js, plus `nonAzure: true`,
   which tells the simulator to render a neutral "Network
   Design Workspace" instead of the mock Azure Portal chrome
   (these labs are deliberately pre-Azure content).
   ========================================================= */

const NETWORKING_FUNDAMENTALS_LABS = [
  {
    id: "netfund-lab-subnet-a-small-office",
    topic: "netfund",
    domain: "Networking Fundamentals",
    nonAzure: true,
    lessonIds: ["netfund-network-host-broadcast", "netfund-cidr-subnetting-1", "netfund-cidr-subnetting-2"],
    title: "Subnet a Small Office Network",
    duration: "10–15 min",
    description: "Practice sizing subnets for a host count and reasoning through network ID / broadcast address by hand.",
    mission: "You're carving departments out of 192.168.10.0/24. Sales needs 25 hosts, Engineering needs 50 hosts, and Guest Wi-Fi has already been assigned 192.168.10.192/27.",
    fields: [
      {
        id: "salesSize",
        label: "Sales needs 25 hosts. What is the smallest CIDR block that fits (25 + 2 = 27 minimum addresses)?",
        options: ["/26 (62 usable)", "/27 (30 usable)", "/28 (14 usable)"],
        answer: "/27 (30 usable)",
        help: "A /28 only offers 14 usable addresses — too small. A /27 offers 30, which fits with the least waste.",
      },
      {
        id: "engineeringSize",
        label: "Engineering needs 50 hosts. What is the smallest CIDR block that fits (50 + 2 = 52 minimum addresses)?",
        options: ["/27 (30 usable)", "/26 (62 usable)", "/25 (126 usable)"],
        answer: "/26 (62 usable)",
        help: "A /27 only offers 30 usable addresses — too small. A /26 offers 62, which fits with the least waste.",
      },
      {
        id: "guestNetworkId",
        label: "Guest Wi-Fi was assigned 192.168.10.192/27. What is its network ID?",
        options: ["192.168.10.192", "192.168.10.0", "192.168.10.224", "192.168.10.191"],
        answer: "192.168.10.192",
        help: "A /27 has a block size of 32. Multiples of 32 near 192 are ...160, 192, 224 — 192 falls exactly on a boundary, so it IS the network ID.",
      },
      {
        id: "guestBroadcast",
        label: "What is the broadcast address of 192.168.10.192/27?",
        options: ["192.168.10.223", "192.168.10.255", "192.168.10.224", "192.168.10.192"],
        answer: "192.168.10.223",
        help: "Block size is 32. The block starting at .192 runs through .192 + 32 - 1 = .223.",
      },
    ],
    success: "You correctly sized two departments for their host counts and derived the network ID and broadcast address of a third subnet by hand.",
    quiz: [
      {
        question: "Why did Sales need a /27 instead of a /28?",
        answer: "A /28 only offers 14 usable addresses, fewer than the 27 needed",
        options: [
          "A /28 only offers 14 usable addresses, fewer than the 27 needed",
          "A /27 is always the standard size for offices",
          "A /28 cannot be used for host devices at all",
          "A /27 uses a different addressing scheme entirely",
        ],
        explanation: "The smallest block that meets the minimum usable-address requirement is the correct choice — /28's 14 usable addresses fall short of the 27 needed.",
      },
      {
        question: "For a /27 subnet, what is the block size (total addresses per block)?",
        answer: "32",
        options: ["32", "64", "16", "8"],
        explanation: "A /27 leaves 5 host bits (32-27=5), and 2^5 = 32 addresses per block.",
      },
      {
        question: "If Engineering's subnet is 192.168.10.64/26, what is its usable host range?",
        answer: "192.168.10.65 to 192.168.10.126",
        options: [
          "192.168.10.65 to 192.168.10.126",
          "192.168.10.64 to 192.168.10.127",
          "192.168.10.1 to 192.168.10.62",
          "192.168.10.65 to 192.168.10.127",
        ],
        explanation: "Network ID .64 and broadcast .127 (64+64-1) are excluded, leaving .65 through .126 as usable.",
      },
    ],
  },
  {
    id: "netfund-lab-trace-a-packet",
    topic: "netfund",
    domain: "Networking Fundamentals",
    nonAzure: true,
    lessonIds: ["netfund-what-is-a-network", "netfund-core-services", "netfund-nat-icmp", "netfund-routing"],
    title: "Trace a Packet's Path",
    duration: "8–12 min",
    description: "Walk through what actually happens, step by step, when a laptop reaches a website outside its local network.",
    mission: "A laptop on a private office network wants to load a website. Reason through each step of the journey in the correct order.",
    fields: [
      {
        id: "firstHop",
        label: "The destination is outside the local network. Where does the laptop send its traffic first?",
        options: ["The default gateway", "A DNS server directly", "The destination server directly", "A DHCP server"],
        answer: "The default gateway",
        help: "Anything outside the local subnet must go through the default gateway first.",
      },
      {
        id: "nameResolution",
        label: "Before it can even address the request, what has to happen so the laptop knows which IP address to use?",
        options: ["DNS resolves the site's name to an IP address", "ARP resolves the destination's MAC address directly", "NAT translates the destination address", "The route table is deleted"],
        answer: "DNS resolves the site's name to an IP address",
        help: "The browser only has a name (like a URL) to start with — DNS turns that into an IP address.",
      },
      {
        id: "localDelivery",
        label: "On its own local segment, how does the laptop find the physical (MAC) address of its default gateway?",
        options: ["ARP", "DNS", "DHCP", "NAT"],
        answer: "ARP",
        help: "ARP resolves a known local IP address (the gateway's) to its MAC address for local delivery.",
      },
      {
        id: "internetEdge",
        label: "The laptop only has a private IP address. What lets its traffic actually reach the public internet using the office's one public IP?",
        options: ["NAT/PAT", "A VLAN", "The subnet mask alone", "The broadcast address"],
        answer: "NAT/PAT",
        help: "NAT/PAT translates the private address to the shared public address at the network edge.",
      },
    ],
    success: "You correctly reasoned through the full path: gateway, DNS, ARP, and NAT/PAT, in the order they actually happen.",
    quiz: [
      {
        question: "Does a router need to know the entire remaining path to a destination?",
        answer: "No, only its own next hop",
        options: ["No, only its own next hop", "Yes, the full path must be known", "Only for local traffic", "Only for UDP traffic"],
        explanation: "Each router only makes its own local next-hop decision; the packet is forwarded hop by hop.",
      },
      {
        question: "If DNS fails but the network itself is fine, what will the user typically experience?",
        answer: "Websites fail to load by name, but a raw IP address still works",
        options: [
          "Websites fail to load by name, but a raw IP address still works",
          "Nothing at all will work, including pings to raw IP addresses",
          "Only email will stop working",
          "The laptop will lose its IP address entirely",
        ],
        explanation: "DNS failure specifically breaks name-based access; raw IP connectivity is a separate, still-working layer.",
      },
      {
        question: "ARP operates within which scope?",
        answer: "Only the local network segment",
        options: ["Only the local network segment", "Across the entire internet", "Only inside a VPN tunnel", "Only for UDP traffic"],
        explanation: "ARP resolves IP-to-MAC mappings only for devices on the same local segment.",
      },
    ],
  },
  {
    id: "netfund-lab-diagnose-local-network",
    topic: "netfund",
    domain: "Networking Fundamentals",
    nonAzure: true,
    lessonIds: ["netfund-network-host-broadcast", "netfund-core-services", "netfund-firewalls-security"],
    title: "Diagnose a Local Network Problem",
    duration: "10–15 min",
    description: "Practice a repeatable, layer-by-layer troubleshooting order instead of guessing randomly.",
    mission: "A PC cannot reach a file server on a different subnet in the same building. Work through the checks in the correct order.",
    fields: [
      {
        id: "step1",
        label: "What should you check first?",
        options: ["The PC's IP address and subnet mask", "The file server's disk space", "The application's source code", "The office's paint color"],
        answer: "The PC's IP address and subnet mask",
        help: "Always confirm basic addressing is correct before looking further up the stack.",
      },
      {
        id: "step2",
        label: "IP and mask look correct. What should you check next?",
        options: ["Whether a valid default gateway/route exists to the destination subnet", "The file server's backup schedule", "The Wi-Fi password", "The monitor's refresh rate"],
        answer: "Whether a valid default gateway/route exists to the destination subnet",
        help: "With addressing confirmed, the next layer is whether a path to the destination exists at all.",
      },
      {
        id: "step3",
        label: "Routing looks fine. What next?",
        options: ["Firewall/security rules that might be blocking the traffic", "The physical color of the network cable", "The desktop wallpaper", "The printer queue"],
        answer: "Firewall/security rules that might be blocking the traffic",
        help: "A correct route can still be blocked by a firewall or equivalent security rule along the way.",
      },
      {
        id: "step4",
        label: "The firewall allows it, but the PC still can't reach the file share. What should you check next?",
        options: ["Whether the file-sharing service is actually running on the server", "The router's LED lights", "The PC's screen brightness", "The guest Wi-Fi password"],
        answer: "Whether the file-sharing service is actually running on the server",
        help: "A perfect network path means nothing if the destination service itself isn't running.",
      },
    ],
    success: "You worked through the problem in the correct order: addressing, routing, firewall/security rules, then the destination service itself — instead of guessing randomly.",
    quiz: [
      {
        question: "Why check IP/subnet addressing before firewall rules?",
        answer: "Basic connectivity has to exist before permission rules are even relevant",
        options: [
          "Basic connectivity has to exist before permission rules are even relevant",
          "Firewall rules are checked automatically by the OS first",
          "IP addressing is unrelated to firewall troubleshooting",
          "It doesn't matter what order you check things in",
        ],
        explanation: "Working from the lowest layer up avoids wasting time on higher-layer checks when a lower layer is actually broken.",
      },
      {
        question: "A route to the destination exists and is correct. Does that guarantee the traffic will be allowed?",
        answer: "No — a firewall or equivalent rule can still block it",
        options: ["No — a firewall or equivalent rule can still block it", "Yes, a correct route always means the traffic is allowed"],
        explanation: "Routing decides the path; a separate firewall/security rule decides permission.",
      },
      {
        question: "The network path and firewall are both fine, but the connection still fails. What layer is left to check?",
        answer: "Whether the destination application/service itself is running",
        options: [
          "Whether the destination application/service itself is running",
          "The subnet mask again",
          "The default gateway again",
          "ARP tables on every device on the network",
        ],
        explanation: "Once the network path and permission are both confirmed working, the remaining layer is the destination service itself.",
      },
    ],
  },
];
