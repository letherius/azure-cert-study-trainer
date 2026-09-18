/* =========================================================
   NETWORKING FUNDAMENTALS TRACK
   14 lessons taking a learner with no networking background
   from "what is a network" through routing, VLANs, firewalls,
   and VPNs — ending with an explicit bridge into Azure
   networking. This track intentionally goes beyond what
   AZ-104 measures (examLevel: "career") because a Cloud
   Engineer needs this foundation to reason about Azure
   networking instead of memorizing it.

   Shares the same lesson schema as data/lessons.js, plus two
   fields specific to this track:
     diagram         - a short ASCII/text diagram (rendered in
                       a monospace block)
     azureConnection - an explicit "how this maps to Azure"
                       paragraph, since these lessons are not
                       themselves Azure content
   ========================================================= */

const NETWORKING_FUNDAMENTALS_LESSONS = [
  {
    id: "netfund-what-is-a-network",
    topic: "netfund",
    domain: "Networking Fundamentals",
    title: "What Is a Network, Really?",
    examLevel: "career",
    summary: "Before touching Azure, get comfortable with what a network actually is: devices, connections, and the addresses that identify them.",
    plain: "A network is just a group of devices that can send information to each other. Your laptop, a printer, a server — if they can exchange data, they're on a network. Everything else (IP addresses, routers, the internet) exists to answer one question: how does this device's data get to that device?",
    why: "Every single thing you'll do as a Cloud Engineer — deploying a VM, troubleshooting a connection, configuring a firewall rule — is really a question about how devices reach each other. If you've never had to think about that at the IT-department level, this lesson (and the ones that follow) build that muscle from zero before Azure adds its own vocabulary on top.",
    analogy: "Think of a network like a postal system. Every house (device) has an address. Mail (data) gets picked up, routed through sorting facilities (routers), and delivered to the right mailbox. A neighborhood's internal mail system is small and simple; the worldwide postal network connecting every country is the same idea, just much bigger.",
    diagram:
      "  [Laptop] ---\\\n" +
      "               \\\n" +
      "   [Printer] ---+--- [Switch] --- [Router] --- (to other networks)\n" +
      "               /\n" +
      "   [Server]  --/\n",
    terminology: [
      { term: "Network", definition: "Two or more devices connected so they can exchange data." },
      { term: "LAN (Local Area Network)", definition: "A network confined to one physical location, like an office floor or a home." },
      { term: "WAN (Wide Area Network)", definition: "A network that spans multiple locations, often connected over the internet or leased lines — the internet itself is the largest WAN." },
      { term: "NIC (Network Interface Card)", definition: "The hardware (physical or virtual) that lets a device connect to a network. Every network connection — Wi-Fi, Ethernet, or an Azure VM's virtual NIC — goes through one." },
      { term: "MAC address", definition: "A unique physical hardware address burned into a NIC, used for local delivery on the same network segment. Format: six pairs of hex digits, e.g. 00:1A:2B:3C:4D:5E." },
    ],
    points: [
      "A LAN is one location; a WAN connects multiple locations together.",
      "Every device that talks on a network does so through a NIC — physical (a laptop's Ethernet port) or virtual (an Azure VM's virtual NIC).",
      "A MAC address identifies a specific NIC and is used for delivery within one local network segment.",
      "An IP address (covered next) identifies where a device is on the larger network — MAC handles 'this segment,' IP handles 'anywhere.'",
      "The internet is not one network — it's millions of networks connected together and agreeing to speak the same addressing rules.",
    ],
    distinctions: [
      { a: "LAN", b: "WAN", note: "A LAN is confined to one site (a building, a home). A WAN connects separate sites together — your company's LANs in three cities, joined by a WAN link, form one larger corporate network." },
      { a: "MAC address", b: "IP address", note: "A MAC address is burned into hardware and used for local delivery on the same segment. An IP address is a logical, assignable address used to route data across different networks — including the internet. Every packet, once it leaves the local segment, is delivered hop-by-hop using IP addresses, with MAC addresses only relevant for the 'last local hop.'" },
    ],
    scenario: "A small office has 12 computers, a printer, and a file server, all in one room, connected to the same switch. That's a LAN. When that office later connects to a branch office in another city over the internet, the two LANs joined together form a WAN.",
    realWorldExample: "When you open a laptop and it says \"Connected\" to Wi-Fi, your laptop's wireless NIC has joined the local network (the LAN). When you then load a website hosted somewhere else in the world, your request leaves that LAN, crosses the WAN (the internet), and reaches a server thousands of miles away — then the response finds its way all the way back to your specific NIC.",
    azureConnection: "In Azure, a Virtual Network (VNet) plays the role of your LAN — a private network you control. Every Azure VM gets a virtual NIC, exactly like a physical computer needs a physical NIC. When VNets in different Azure regions (or an Azure VNet and your on-premises office) are connected together, you've built a WAN — Azure just calls the connecting technologies VNet peering, VPN Gateway, or ExpressRoute, which later lessons cover in detail.",
    commonMistakes: [
      "Assuming \"the network\" always means \"the internet\" — most networking work is about private LANs that never touch the public internet directly.",
      "Confusing a NIC with a network cable or Wi-Fi signal — the NIC is the device-side hardware/software component that uses those to connect.",
      "Thinking MAC addresses can be used to reach a device across the internet — they only work within the local network segment.",
    ],
    traps: [
      "Don't assume more devices automatically means a WAN — a LAN can have thousands of devices and still be one location.",
      "A device can have multiple NICs (e.g., a server with wired and wireless adapters, or a VM with multiple virtual NICs) — each one gets its own MAC and can get its own IP.",
    ],
    remember: "LAN = one place. WAN = connected places. NIC = the door a device uses to get on the network. MAC = the door's serial number. IP = the door's mailing address.",
    relatedLab: null,
    knowledgeCheck: [
      {
        question: "Your company's three office buildings, each with their own internal network, are connected together over the internet. What best describes the result?",
        options: ["A WAN made of three connected LANs", "A single NIC", "A single MAC address", "A loopback address"],
        answer: "A WAN made of three connected LANs",
        explanation: "Connecting separate LANs across locations is the definition of a WAN.",
      },
      {
        question: "Which address is burned into network hardware and used only for local delivery?",
        options: ["MAC address", "IP address"],
        answer: "MAC address",
        explanation: "MAC addresses handle delivery within one local segment; IP addresses handle routing across networks.",
      },
    ],
  },
  {
    id: "netfund-ipv4-addressing",
    topic: "netfund",
    domain: "Networking Fundamentals",
    title: "IPv4 Addresses: Public, Private, Static, and Dynamic",
    examLevel: "career",
    summary: "Learn what an IP address actually is, the difference between public and private addresses, and how a device gets one.",
    plain: "An IPv4 address is a 32-bit number, written as four decimal numbers separated by dots (like 192.168.10.25), that identifies a device on a network. Some addresses are 'private' and only make sense inside your own network; others are 'public' and reachable from the internet.",
    why: "Almost every troubleshooting conversation you'll have as a Cloud Engineer starts with an IP address. Knowing instantly whether an address is private or public, and whether it's assigned automatically or by hand, tells you where to even start looking for a problem.",
    analogy: "A public IP address is like your street address — anyone in the world can look it up and send you mail. A private IP address is like an apartment number inside a building — it only makes sense to people already inside that building (your local network); the outside world only ever sees the building's street address.",
    diagram:
      "        PRIVATE NETWORK                       INTERNET\n" +
      "  [PC: 192.168.1.10] --\\                          |\n" +
      "  [PC: 192.168.1.11] ---+-- [Router/NAT] --------- [Public IP: 20.51.3.4]\n" +
      "  [PC: 192.168.1.12] --/       |\n" +
      "                         (private addresses hidden\n" +
      "                          behind one public address)\n",
    terminology: [
      { term: "IPv4 address", definition: "A 32-bit address written as four numbers 0-255 separated by dots, e.g. 10.0.1.5." },
      { term: "Public IP address", definition: "An address that is unique and reachable across the internet." },
      { term: "Private IP address", definition: "An address reserved for use inside private networks; not routable on the public internet." },
      { term: "Static IP address", definition: "An address manually assigned to a device that does not change." },
      { term: "Dynamic IP address", definition: "An address automatically assigned by a DHCP server, which can change over time." },
      { term: "APIPA (Automatic Private IP Addressing)", definition: "A 169.254.x.x address a Windows device gives itself when it can't reach a DHCP server — a strong sign of a DHCP or connectivity problem." },
      { term: "Loopback address", definition: "127.0.0.1 (and the 127.0.0.0/8 range) — always refers to \"this same device,\" used to test a device's own network stack." },
    ],
    points: [
      "The private IPv4 ranges are 10.0.0.0/8, 172.16.0.0/12, and 192.168.0.0/16 — anything in those ranges is private by definition.",
      "A private address means nothing to the outside internet; it only has meaning inside the network that assigned it.",
      "Static addressing is used for things that must not change (servers, printers, network devices); dynamic addressing (via DHCP) is used for everything else.",
      "Seeing a 169.254.x.x (APIPA) address on a device almost always means DHCP failed and the device gave up and self-assigned.",
      "IPv6 exists because the world ran out of IPv4 addresses; it uses much longer addresses (like 2001:0db8:85a3::8a2e:0370:7334) and is increasingly common alongside IPv4, though this course focuses on IPv4 since it's what you'll work with daily in Azure administration.",
    ],
    distinctions: [
      { a: "Public IP", b: "Private IP", note: "Public IPs are globally unique and reachable from the internet. Private IPs are reserved ranges that only have meaning inside a private network — the same private address (like 192.168.1.10) can exist independently on thousands of unrelated networks at once." },
      { a: "Static addressing", b: "Dynamic addressing", note: "Static means a human assigned the address and it won't change on its own. Dynamic means a DHCP server assigned it automatically and it can change when the lease renews or the device reconnects." },
    ],
    scenario: "A home network has a single public IP address from the ISP, but five devices (laptop, phone, smart TV, tablet, game console) all have private addresses like 192.168.1.x. The router uses NAT (a later lesson) to let all five share that one public address when reaching the internet.",
    realWorldExample: "A Windows laptop that can't get on Wi-Fi shows an IP address of 169.254.34.12. An experienced technician immediately recognizes this as APIPA — the laptop couldn't reach a DHCP server — and starts troubleshooting DHCP or the physical/Wi-Fi connection, rather than looking at applications or firewalls first.",
    azureConnection: "Every Azure VM gets a private IP address from its VNet's address space by default — that private address works only inside that VNet (and anything connected to it), exactly like a private address on any other network. If a VM also needs to be reachable from the internet, Azure assigns it a separate public IP address, resource by resource — this public/private split is identical to the concept taught here, just implemented as an Azure resource instead of a home router.",
    commonMistakes: [
      "Assuming every IP address is reachable from anywhere — most addresses you'll work with day to day are private and only reachable from inside the same network.",
      "Not recognizing a 169.254.x.x address as a DHCP failure symptom, and troubleshooting the wrong layer as a result.",
      "Forgetting that the same private address range can be reused independently on completely unrelated networks — that's normal, not a conflict, unless those networks are later connected together.",
    ],
    traps: [
      "127.0.0.1 always means \"myself\" — it can never be used to reach another device.",
      "A private address range (like 10.0.0.0/8) is enormous — being \"in\" that range doesn't mean two devices are on the same network; the subnet mask determines that.",
    ],
    remember: "Public = reachable from the internet. Private = only reachable inside the local network. Static = a human set it. Dynamic = DHCP set it. 169.254.x.x = DHCP failed.",
    relatedLab: null,
    knowledgeCheck: [
      {
        question: "A Windows PC shows IP address 169.254.12.9. What does this most likely indicate?",
        options: ["DHCP failed and the device self-assigned an APIPA address", "The PC has a valid static public IP", "The PC is using IPv6", "The PC is using the loopback address"],
        answer: "DHCP failed and the device self-assigned an APIPA address",
        explanation: "The 169.254.0.0/16 range is reserved for APIPA, assigned only when DHCP is unreachable.",
      },
      {
        question: "Which of these is a private IPv4 range?",
        options: ["192.168.0.0/16", "20.0.0.0/8", "8.8.8.0/24", "104.16.0.0/12"],
        answer: "192.168.0.0/16",
        explanation: "192.168.0.0/16 is one of the three reserved private ranges; the others are public-looking example ranges.",
      },
    ],
  },
  {
    id: "netfund-network-host-broadcast",
    topic: "netfund",
    domain: "Networking Fundamentals",
    title: "Network ID, Host ID, and Broadcast Address",
    examLevel: "career",
    summary: "Learn what each part of an IP address actually represents, using the subnet mask to split it into network and host portions.",
    plain: "Every IPv4 address has two parts: a network portion (which network this device belongs to) and a host portion (which specific device on that network). The subnet mask is what tells you exactly where that split happens.",
    why: "This is the single idea that makes subnetting (the next two lessons) click. Once you can look at an address and mask and immediately say 'this much is the network, this much is the host,' CIDR math stops being memorization and starts being reasoning.",
    analogy: "Think of a mailing address like '742 Evergreen Terrace, Springfield.' 'Springfield' is like the network portion — it groups many addresses together. '742 Evergreen Terrace' is the host portion — it picks out one specific house inside that city. The subnet mask is what tells you where the city name ends and the house address begins.",
    diagram:
      "  192   .   168   .   10   .   25\n" +
      "  |------- network -------|-host-|\n" +
      "     (first 24 bits)      (last 8 bits)   <- when mask is /24 (255.255.255.0)\n",
    terminology: [
      { term: "Network ID", definition: "The address that identifies the network itself — the host portion is all zeros. For 192.168.10.0/24, the network ID is 192.168.10.0." },
      { term: "Host ID", definition: "The part of the address that identifies one specific device on that network." },
      { term: "Broadcast address", definition: "A special address used to send a message to every device on the network at once — the host portion is all ones. For 192.168.10.0/24, the broadcast address is 192.168.10.255." },
      { term: "Subnet mask", definition: "A 32-bit value (like 255.255.255.0) that marks which bits of an address are the network portion versus the host portion." },
    ],
    points: [
      "The subnet mask's job is to answer one question: how many of the 32 bits are 'network,' and how many are 'host'?",
      "The network ID always has all zeros in the host portion, and can never be assigned to a device.",
      "The broadcast address always has all ones in the host portion, and can never be assigned to a device either.",
      "Every usable (assignable) address sits strictly between the network ID and the broadcast address.",
      "For a /24 network (255.255.255.0), the first three numbers are the network portion and the last number is the host portion — this is the easiest mask to reason about by eye.",
    ],
    scenario: "Given 192.168.10.25 with a /24 mask: the network ID is 192.168.10.0, the broadcast address is 192.168.10.255, and 192.168.10.25 itself is one of the 254 usable host addresses in between.",
    realWorldExample: "An administrator pings 192.168.10.255 on a /24 network as a broadcast test and every device on that subnet responds — because that address isn't \"a device,\" it's the signal for \"everyone on this network, listen up.\" Trying to assign 192.168.10.255 to an actual PC would be a configuration error, since that address is permanently reserved as the broadcast address for that network.",
    azureConnection: "This exact rule is why an Azure VNet subnet always has 5 addresses Azure reserves and you can't assign: the network address, the broadcast address, and three more Azure keeps for its own internal use (default gateway, and two for Azure DNS). When you're told an Azure /24 subnet only gives you 251 usable addresses instead of 254, this network ID / broadcast rule (plus Azure's extra reservations) is exactly why.",
    commonMistakes: [
      "Trying to assign the network ID or broadcast address to a device — both are permanently reserved.",
      "Assuming every network uses a /24 (255.255.255.0) mask — the mask can fall anywhere, which the next lesson covers.",
      "Confusing the broadcast address with a public IP address — they're unrelated concepts.",
    ],
    traps: [
      "The network ID is not \"unused\" — it has a real, important job (identifying the network itself); it's simply never assigned to a device.",
      "Two devices with the same network ID but different masks might actually be on different networks — always check the mask, not just the numbers.",
    ],
    remember: "Network ID = the network's own name (host bits all zero). Broadcast = talk to everyone (host bits all one). Everything else in between is a usable host address.",
    relatedLab: null,
    knowledgeCheck: [
      {
        question: "For the network 10.0.5.0/24, what is the broadcast address?",
        options: ["10.0.5.255", "10.0.5.0", "10.0.5.1", "10.0.6.0"],
        answer: "10.0.5.255",
        explanation: "With a /24 mask, the last octet is the host portion; all ones (255) is the broadcast address.",
      },
      {
        question: "Can the network ID of a subnet ever be assigned to a device?",
        options: ["No, it is always reserved", "Yes, it's just a normal address"],
        answer: "No, it is always reserved",
        explanation: "The network ID (all-zero host bits) identifies the network itself and can never be assigned to a device.",
      },
    ],
  },
  {
    id: "netfund-cidr-subnetting-1",
    topic: "netfund",
    domain: "Networking Fundamentals",
    title: "CIDR Notation and Subnetting, Part 1",
    examLevel: "career",
    summary: "Learn to read a CIDR number like /24 or /26 and immediately reason through the network address, host range, and broadcast address by hand.",
    plain: "CIDR notation (like /24) is a shorthand for the subnet mask — it just states how many of the 32 bits are the network portion. The smaller that number, the more addresses are on the network; the larger that number, the fewer addresses there are.",
    why: "Reading a CIDR block on sight, without a calculator, is a core Cloud Engineer skill — you'll see it in every VNet, every subnet, every NSG rule, and every AZ-104 exam question that mentions an address range.",
    analogy: "Think of CIDR like slicing a pizza. A /24 gives you a big single slice (256 pieces of address space). A /26 cuts that same size pizza into four smaller slices (64 each). A /30 cuts it into 64 tiny slices (4 each) — just enough for two people to share (which is exactly why /30 is the classic size for a point-to-point link between two routers).",
    diagram:
      "  /24  = 256 addresses  |################################|\n" +
      "  /25  = 128 addresses  |################|################|\n" +
      "  /26  =  64 addresses  |########|########|########|########|\n" +
      "  /27  =  32 addresses  |####|####|####|####|####|####|####|####|\n",
    terminology: [
      { term: "CIDR notation", definition: "A slash followed by a number (e.g. /24) stating how many bits of the 32-bit address are the network portion." },
      { term: "Block size", definition: "How many total addresses one subnet of a given CIDR size contains — doubling with every step down in prefix length." },
      { term: "Usable host range", definition: "Every address between the network ID and the broadcast address — the addresses you can actually assign to devices." },
    ],
    points: [
      "/24 = 255.255.255.0 = 256 addresses, 254 usable.",
      "/25 = 255.255.255.128 = 128 addresses, 126 usable.",
      "/26 = 255.255.255.192 = 64 addresses, 62 usable.",
      "/27 = 255.255.255.224 = 32 addresses, 30 usable.",
      "/28 = 255.255.255.240 = 16 addresses, 14 usable.",
      "/29 = 255.255.255.248 = 8 addresses, 6 usable.",
      "/30 = 255.255.255.252 = 4 addresses, 2 usable (the classic size for a link between exactly two routers).",
    ],
    scenario: "You're told a subnet is 192.168.1.64/26. To reason through it: /26 has a block size of 64. Multiples of 64 are 0, 64, 128, 192 — so 64 falls exactly on a boundary. This subnet runs from 192.168.1.64 (network ID) to 192.168.1.127 (broadcast), with 192.168.1.65 through 192.168.1.126 usable (62 addresses).",
    realWorldExample:
      "Worked example: 172.16.5.32/28.\n" +
      "Step 1 — block size: a /28 has 16 addresses per block.\n" +
      "Step 2 — find the boundary: multiples of 16 near 32 are 16, 32, 48 — so 32 is exactly on a boundary. Network ID = 172.16.5.32.\n" +
      "Step 3 — broadcast: one block size up, minus one = 32 + 16 - 1 = 47. Broadcast = 172.16.5.47.\n" +
      "Step 4 — usable range: everything in between = 172.16.5.33 through 172.16.5.46 (14 usable addresses).",
    azureConnection: "This is exactly the math Azure asks you to do when sizing a VNet subnet. If a scenario says \"this subnet must support 20 devices,\" you now know a /28 (14 usable) is too small and a /27 (30 usable) is the right minimum size — this reasoning is tested directly on AZ-104 and used constantly when designing real VNets.",
    commonMistakes: [
      "Trying to memorize a giant table instead of learning the four-step method (block size → boundary → broadcast → usable range) shown above, which works for any CIDR size.",
      "Forgetting to subtract 2 (network ID and broadcast) when counting usable addresses.",
      "Assuming a subnet must start at .0 — subnets can start at any multiple of their own block size (like .32, .64, .96 for a /27).",
    ],
    traps: [
      "A /26 is not \"half\" the addresses of a /24 in some vague sense — it's mathematically exactly one quarter (64 out of 256).",
      "The usable host count is always (2 to the power of host bits) minus 2 — for a /30, that's 2^2 - 2 = 2, not 4.",
    ],
    remember: "Block size doubles every time the prefix number goes down by one. Find the block size, find the boundary the address falls on, and the network ID, broadcast, and usable range all follow.",
    relatedLab: null,
    knowledgeCheck: [
      {
        question: "What is the block size (total addresses per subnet) of a /27?",
        options: ["32", "64", "16", "256"],
        answer: "32",
        explanation: "A /27 leaves 5 host bits (32 - 27 = 5), and 2^5 = 32 addresses per block.",
      },
      {
        question: "For 10.0.0.64/26, what is the broadcast address?",
        options: ["10.0.0.127", "10.0.0.63", "10.0.0.255", "10.0.0.65"],
        answer: "10.0.0.127",
        explanation: "Block size for /26 is 64; the block starting at .64 ends at .64+64-1 = .127.",
      },
    ],
  },
  {
    id: "netfund-cidr-subnetting-2",
    topic: "netfund",
    domain: "Networking Fundamentals",
    title: "CIDR Notation and Subnetting, Part 2 (Practice)",
    examLevel: "career",
    summary: "Apply the subnetting method from Part 1 to harder, real-world-style problems: sizing a subnet for a host count, and splitting a network into equal pieces.",
    plain: "Real subnetting questions rarely just ask 'what's the broadcast address.' They ask things like 'what's the smallest subnet that fits 100 devices' or 'split this /16 into 4 equal networks.' This lesson works through both patterns.",
    why: "These two problem types — 'size a subnet for N hosts' and 'split a block into equal subnets' — are the two patterns that show up constantly in real VNet design and on the AZ-104 exam. Once you're comfortable with both, CIDR stops being intimidating.",
    analogy: "Sizing a subnet for a host count is like choosing a moving truck: you need one just big enough for your furniture (plus a little extra for the network ID and broadcast \"packing space\"), not the biggest truck available. Splitting a block into equal subnets is like cutting one pizza into an equal number of same-size slices for everyone at the table.",
    terminology: [
      { term: "Host requirement", definition: "The number of usable addresses a subnet must support — always add 2 to this before choosing a CIDR size, to leave room for the network ID and broadcast address." },
      { term: "Equal-size subnetting", definition: "Splitting one larger address block into several smaller blocks, all the same size, by borrowing bits from the host portion." },
    ],
    points: [
      "To size a subnet for N hosts: find the smallest CIDR block whose usable count (2^host bits - 2) is greater than or equal to N.",
      "100 hosts needs at least 102 addresses → a /25 (126 usable) fits; a /26 (62 usable) does not.",
      "To split a block into 4 equal subnets, borrow 2 bits (since 2^2 = 4) — a /16 split 4 ways becomes four /18 blocks.",
      "To split a block into 8 equal subnets, borrow 3 bits (2^3 = 8) — a /24 split 8 ways becomes eight /27 blocks.",
      "Always double-check your answer by re-deriving the network ID and broadcast address of your new subnet using the Part 1 method.",
      "When a scenario mentions expected future growth (not just today's headcount), size for the larger future number, not the current one — picking a subnet that's already full on day one just creates a re-addressing problem later.",
    ],
    scenario: "You need a subnet for a department with 45 employees, plus 3 network devices — 48 hosts total. 48 + 2 = 50 minimum addresses. A /27 (30 usable) is too small; a /26 (62 usable) fits with room to grow.",
    realWorldExample:
      "Worked example — splitting into equal subnets: You're given 10.20.0.0/16 and need exactly 4 equal-size subnets.\n" +
      "Step 1: 4 subnets needs 2 borrowed bits (2^2 = 4), so the new prefix is /16 + 2 = /18.\n" +
      "Step 2: block size of a /18 is 2^(32-18) = 16384 addresses, which in the third octet steps by 64 (16384 / 256 = 64).\n" +
      "Step 3: the four subnets are 10.20.0.0/18, 10.20.64.0/18, 10.20.128.0/18, and 10.20.192.0/18.\n" +
      "Step 4: each has 16384 total addresses (16382 usable) — plenty for four large departments.",
    azureConnection: "This is precisely how real hub-and-spoke VNet designs get planned: an architect takes one large address space (say a /16 assigned to a project) and divides it into equal-size subnets for a web tier, an app tier, a data tier, and a gateway subnet — using exactly this method, before a single Azure resource is created.",
    commonMistakes: [
      "Forgetting to add 2 to a host requirement before picking a CIDR size, resulting in a subnet that's exactly too small.",
      "Rounding a host count down instead of up when nothing else fits exactly (e.g., treating a need for 130 hosts as fitting a /25's 126 usable addresses — it doesn't; a /24 is required).",
      "Miscounting how many bits to borrow for equal-size subnetting — always check that 2^(borrowed bits) equals the exact number of subnets needed.",
      "Sizing exactly to today's headcount when the scenario tells you the team is expected to grow — the next-larger block is usually cheap in address space and saves a painful re-addressing project later.",
    ],
    traps: [
      "\"Enough addresses for 100 devices\" always means 100 usable addresses, not 100 total addresses including network ID and broadcast.",
      "Splitting into subnets that are almost, but not quite, a power of two (like 5 equal subnets) doesn't divide evenly with this method — real designs round up to the next power of two (8, in that case) and simply leave extra subnets unused or reserved for growth.",
    ],
    remember: "Sizing for hosts: add 2, then find the smallest block that fits. Splitting equally: figure out how many bits to borrow so 2^borrowed = the number of pieces you need.",
    relatedLab: "netfund-lab-subnet-a-small-office",
    knowledgeCheck: [
      {
        question: "A subnet must support 130 hosts. Which is the smallest CIDR block that fits?",
        options: ["/24 (254 usable)", "/25 (126 usable)", "/26 (62 usable)", "/23 (510 usable)"],
        answer: "/24 (254 usable)",
        explanation: "130 + 2 = 132 minimum addresses needed; a /25 only offers 126 usable, which is too small, so /24 is the smallest that fits.",
      },
      {
        question: "To split a /20 network into 8 equal subnets, how many bits must you borrow?",
        options: ["3 bits (2^3 = 8)", "8 bits", "2 bits", "4 bits"],
        answer: "3 bits (2^3 = 8)",
        explanation: "You need 2^borrowed bits to equal the number of subnets; 2^3 = 8.",
      },
    ],
  },
  {
    id: "netfund-core-services",
    topic: "netfund",
    domain: "Networking Fundamentals",
    title: "Default Gateway, DNS, DHCP, and ARP",
    examLevel: "career",
    summary: "Learn the four background services every device relies on just to get on the network and reach anything beyond it.",
    plain: "A default gateway gets you off your local network. DNS turns names into IP addresses. DHCP hands out IP addresses automatically. ARP finds the MAC address that matches a known IP address on the local network. Every single one of these runs quietly in the background of every network conversation you'll ever troubleshoot.",
    why: "An enormous share of real-world connectivity tickets — and a huge share of AZ-104 troubleshooting questions — boil down to one of these four services misbehaving. Knowing what each one's job is (and isn't) lets you eliminate three of them in seconds and focus on the real cause.",
    analogy: "The default gateway is your neighborhood's exit onto the highway — without it, you're stuck driving around your own block forever. DNS is a phone book that turns a name into a number you can actually dial. DHCP is the front desk that hands new guests a room number when they check in. ARP is shouting \"whose room number is this?\" down the hallway to find out which physical door to knock on.",
    diagram:
      "  [Your PC] --ARP--> \"Who has 10.0.0.1?\" --> [Router replies with its MAC]\n" +
      "  [Your PC] --default gateway--> [Router] --> rest of the network / internet\n" +
      "  [Your PC] --DNS query--> [DNS server] --> \"contoso.com is 20.51.3.4\"\n" +
      "  [Your PC] --DHCP request--> [DHCP server] --> \"Here's your IP, mask, gateway, DNS\"\n",
    terminology: [
      { term: "Default gateway", definition: "The address of the router a device sends traffic to when the destination is outside its own local network." },
      { term: "DNS (Domain Name System)", definition: "The service that translates human-readable names (like contoso.com) into IP addresses." },
      { term: "DHCP (Dynamic Host Configuration Protocol)", definition: "The service that automatically hands a connecting device an IP address, subnet mask, default gateway, and DNS server addresses." },
      { term: "ARP (Address Resolution Protocol)", definition: "The protocol a device uses to discover the MAC address associated with a known IP address on the same local network." },
      { term: "DHCP lease", definition: "The time period a dynamically assigned IP address is valid for, before it must be renewed." },
    ],
    points: [
      "Without a correct default gateway, a device can talk to other devices on its own subnet but nothing outside it.",
      "DNS failure looks like \"the internet is down\" to a user, even though the network itself is often working fine — only name resolution is broken.",
      "DHCP hands out four key things at once: IP address, subnet mask, default gateway, and DNS server address(es).",
      "ARP only operates within a single local network segment — it's how a device finds the physical (MAC) address that goes with an IP address it already knows.",
      "A device with a valid IP address can still fail to reach anything if its default gateway or DNS settings are wrong or missing.",
    ],
    distinctions: [
      { a: "DNS failure", b: "Connectivity failure", note: "If DNS fails, a user typically can't reach anything by name (like a website), but can still reach a destination by its raw IP address. If actual connectivity is broken, even the raw IP address won't respond. This distinction is often the very first troubleshooting fork in the road." },
    ],
    scenario: "A user reports 'the internet is completely down.' You have them try pinging 8.8.8.8 (a well-known public IP) — it works. Then you have them try opening a website by name — it fails. This narrows the problem specifically to DNS, not general connectivity.",
    realWorldExample: "A newly connected laptop shows a valid-looking IP address (192.168.1.45) but can't reach anything outside its own subnet. Checking its configuration shows no default gateway was assigned — most likely a DHCP scope misconfiguration on the network's DHCP server, since DHCP is supposed to hand out the gateway address along with the IP.",
    azureConnection: "Azure automatically provides DHCP-like behavior for every VNet subnet (assigning private IPs to VMs) and a default route to the internet unless you override it. Azure DNS and Azure Private DNS play the exact DNS role described here, just hosted as an Azure service instead of an on-premises server. When an AZ-104 scenario says 'DNS resolves correctly but the connection still fails,' this lesson's distinction between DNS and connectivity is exactly the reasoning being tested.",
    commonMistakes: [
      "Assuming a 'the internet is down' report means the whole network is broken, when it's very often just DNS.",
      "Forgetting that a correct IP address and mask mean nothing for reaching other networks without a correct default gateway.",
      "Troubleshooting DNS or the application layer before confirming basic IP connectivity (like a successful ping) actually works.",
    ],
    traps: [
      "A successful ping to a name (like ping contoso.com) actually tests two things at once: DNS (did the name resolve?) and connectivity (did the ping reply come back?). A failure could be either — ping the raw IP address separately to isolate which one.",
      "ARP failures are rare to diagnose directly, but understanding that ARP exists explains why two devices with correct IPs can still fail to talk if something is interfering with local delivery (like a misconfigured switch).",
    ],
    remember: "No gateway = stuck on your own subnet. No DNS = can't find things by name. No DHCP = no automatic address at all. ARP = how a device finds a neighbor's physical address.",
    relatedLab: null,
    knowledgeCheck: [
      {
        question: "A user can reach 8.8.8.8 by IP address but cannot open any website by name. What is most likely broken?",
        options: ["DNS", "The default gateway", "DHCP", "ARP"],
        answer: "DNS",
        explanation: "Successful IP connectivity but failed name-based access is the classic signature of a DNS problem.",
      },
      {
        question: "Which four settings does DHCP typically hand out together?",
        options: ["IP address, subnet mask, default gateway, DNS servers", "MAC address, loopback address, ARP table, broadcast address", "Username, password, hostname, domain", "Public IP, private IP, VLAN ID, NIC speed"],
        answer: "IP address, subnet mask, default gateway, DNS servers",
        explanation: "These four are the standard set of settings a DHCP server assigns to a connecting device.",
      },
    ],
  },
  {
    id: "netfund-nat-icmp",
    topic: "netfund",
    domain: "Networking Fundamentals",
    title: "NAT, PAT, and ICMP",
    examLevel: "career",
    summary: "Understand how private networks share a public IP address, and how devices test reachability with ICMP.",
    plain: "NAT lets private, non-routable addresses talk to the internet by translating them to a public address at the edge of the network. PAT is the common version of NAT that lets many private devices share just one public address at the same time. ICMP is the protocol behind tools like ping, used to test whether a destination is reachable.",
    why: "Nearly every private network you'll ever touch — home, office, or a cloud VNet's outbound internet access — relies on NAT/PAT to reach the internet. And ICMP (ping) is usually the very first tool reached for in any connectivity troubleshooting.",
    analogy: "NAT/PAT is like an office's single fax number: many employees inside share that one outward-facing number, but the front desk (the NAT device) keeps track of exactly which employee's outgoing fax belongs to which reply, so responses find their way back to the right desk even though outsiders only ever see the one shared number.",
    diagram:
      "  [PC 192.168.1.10]--\\\n" +
      "  [PC 192.168.1.11]---+--[Router doing PAT]--- Public IP 20.51.3.4 ---> Internet\n" +
      "  [PC 192.168.1.12]--/        (tracks which private PC each\n" +
      "                               reply belongs to)\n",
    terminology: [
      { term: "NAT (Network Address Translation)", definition: "Translating a private IP address to a public one (and back) so private devices can communicate with the internet." },
      { term: "PAT (Port Address Translation)", definition: "The most common form of NAT, where many private devices share one public IP address, distinguished from each other by port numbers." },
      { term: "ICMP (Internet Control Message Protocol)", definition: "A protocol used for diagnostic and status messages, most famously powering the ping and traceroute tools." },
    ],
    points: [
      "NAT/PAT exists because private IP address ranges are not allowed to be routed on the public internet.",
      "PAT lets an entire office share one single public IP address for outbound internet access, which is why home routers only ever get one public IP from an ISP.",
      "ICMP echo request/reply is what ping actually sends and listens for — a successful ping means basic IP reachability exists, nothing more (it doesn't test a specific application or port).",
      "Some networks intentionally block ICMP for security reasons, so a failed ping does not always mean the destination is actually unreachable.",
      "Traceroute uses ICMP (or similar) to reveal every router hop between you and a destination, which is useful for finding where along a path a failure occurs.",
    ],
    distinctions: [
      { a: "NAT", b: "PAT", note: "Plain NAT can be a one-to-one translation (one private address maps to one dedicated public address). PAT is the many-to-one version most networks actually use, where many private devices share a single public address, kept distinct by port number." },
    ],
    scenario: "An office with 50 employees has only one public IP address from its ISP. Every employee's laptop uses a private 192.168.x.x address, and PAT on the edge router lets all 50 reach the internet simultaneously using that single shared public address.",
    realWorldExample: "An administrator pings a server and gets no reply, and initially assumes the server is down. After checking further, the server is actually running fine — its firewall is simply configured to block ICMP for security reasons. This is a common trap: a failed ping proves nothing is answering ICMP, not that the destination itself is unreachable for real traffic like HTTPS.",
    azureConnection: "Outbound internet access from an Azure VM with no public IP works through a form of Azure-managed NAT/PAT by default (and can be made more predictable and scalable with a NAT Gateway resource, covered in the Azure Networking bridge lesson). Network Watcher's connectivity tools, and the humble ping/traceroute, are still exactly how Azure administrators start most connectivity troubleshooting — this lesson's ICMP caveat (some things block it on purpose) applies directly to Azure NSGs and firewalls too.",
    commonMistakes: [
      "Concluding a service is completely down just because ping fails, without checking whether ICMP is simply blocked.",
      "Assuming every device on a private network needs, or gets, its own public IP address — most rely on shared PAT instead.",
      "Confusing NAT/PAT (an internet-access mechanism) with a VPN (a private connectivity mechanism, covered in a later lesson) — they solve different problems.",
    ],
    traps: [
      "A blocked ICMP response looks identical to \"nothing is there\" from the pinging device's point of view — always confirm with a protocol the destination actually accepts (like HTTPS) before declaring something unreachable.",
      "NAT/PAT translates addresses for outbound-initiated traffic; it is not, by itself, a security firewall, even though it has the side effect of hiding internal addresses from the outside.",
    ],
    remember: "NAT/PAT lets private addresses reach the public internet by translating (and usually sharing) a public address. ICMP/ping tests basic reachability only — a failure can mean \"unreachable\" or just \"blocked on purpose.\"",
    relatedLab: null,
    knowledgeCheck: [
      {
        question: "Fifty office PCs with private IPs all reach the internet using one shared public IP address. What makes this possible?",
        options: ["PAT (Port Address Translation)", "DHCP", "ARP", "A loopback address"],
        answer: "PAT (Port Address Translation)",
        explanation: "PAT is the many-private-devices-to-one-public-address translation mechanism.",
      },
      {
        question: "A ping to a server fails. What is the safest conclusion?",
        options: ["ICMP got no reply — the server might still be reachable on other protocols", "The server is definitely completely down", "The server's DNS is broken", "The server has the wrong subnet mask"],
        answer: "ICMP got no reply — the server might still be reachable on other protocols",
        explanation: "ICMP can be intentionally blocked while the server remains reachable over other protocols like HTTPS.",
      },
    ],
  },
  {
    id: "netfund-tcp-udp-ports",
    topic: "netfund",
    domain: "Networking Fundamentals",
    title: "TCP vs UDP, and the Ports You'll See Constantly",
    examLevel: "career",
    summary: "Learn the practical difference between TCP and UDP, and memorize the port numbers that show up in real troubleshooting and NSG rules.",
    plain: "TCP and UDP are the two main ways data actually travels once it reaches its destination network. TCP double-checks everything arrived correctly; UDP just sends it and doesn't look back. A port number tells the receiving device which specific service or application the traffic is meant for.",
    why: "You cannot write a correct NSG rule, read a firewall log, or troubleshoot 'why can't this app connect' without knowing which port and protocol the application actually uses — this is some of the most immediately practical knowledge in this entire course.",
    analogy: "TCP is like a phone call with someone repeating back what you said to confirm they heard it correctly — slower, but reliable. UDP is like shouting an announcement over a loudspeaker once — fast, but if someone didn't hear it, nobody knows or resends it. You'd use a phone call for something important (a bank transfer, TCP) and a loudspeaker for something time-sensitive where a missed word doesn't matter (a live video stream, UDP).",
    diagram:
      "  TCP: [SYN] -> <- [SYN-ACK] -> [ACK] -> ... data with acknowledgment ...\n" +
      "  UDP: [data] -> [data] -> [data] ->  (no handshake, no acknowledgment)\n",
    terminology: [
      { term: "TCP (Transmission Control Protocol)", definition: "A connection-oriented protocol that establishes a handshake, confirms delivery, and resends lost data — reliable but with more overhead." },
      { term: "UDP (User Datagram Protocol)", definition: "A connectionless protocol that sends data without confirming delivery — faster, lower overhead, but not reliable on its own." },
      { term: "Port number", definition: "A number (0-65535) identifying a specific service or application on a device, alongside its IP address." },
      { term: "Well-known ports", definition: "The 0-1023 range, reserved for standard, widely recognized services like HTTP (80) and HTTPS (443)." },
    ],
    points: [
      "TCP is used when reliability matters more than raw speed: web browsing (HTTP/HTTPS), email, file transfer, remote desktop.",
      "UDP is used when speed matters more than guaranteed delivery: DNS lookups, streaming video/audio, VoIP calls, online gaming.",
      "A single device can run many services at once because each one listens on its own port — the IP address gets you to the device, the port gets you to the right service on it.",
      "An IP address plus a port number together (like 10.0.1.5:443) fully identify one specific conversation endpoint.",
      "Knowing a service's default port is exam- and job-critical: it's the first thing you check when a firewall or NSG rule is blocking something unexpectedly.",
    ],
    distinctions: [
      { a: "TCP", b: "UDP", note: "TCP guarantees delivery and order via a handshake and acknowledgments, at the cost of some speed. UDP has no handshake and no guarantee — it's faster and lower-overhead, which is exactly why it's used for things where a little loss is acceptable but delay is not." },
    ],
    scenario: "An NSG rule blocks inbound TCP port 3389 to a VM. RDP (Remote Desktop) stops working immediately, because RDP specifically uses TCP 3389 — recognizing that port on sight tells you exactly which rule to investigate, without guessing.",
    realWorldExample:
      "Common ports every Cloud Engineer should recognize on sight:\n" +
      "20/21 = FTP (file transfer)\n" +
      "22 = SSH (secure shell, Linux remote access)\n" +
      "23 = Telnet (unencrypted remote access — legacy, avoid)\n" +
      "25 = SMTP (sending email)\n" +
      "53 = DNS (name resolution)\n" +
      "67/68 = DHCP (automatic IP assignment)\n" +
      "80 = HTTP (unencrypted web)\n" +
      "110 = POP3 (retrieving email)\n" +
      "123 = NTP (time synchronization)\n" +
      "143 = IMAP (retrieving email, keeps mail on server)\n" +
      "389 = LDAP (directory services, like on-prem Active Directory)\n" +
      "443 = HTTPS (encrypted web — the one you'll see constantly)\n" +
      "445 = SMB (Windows file sharing)\n" +
      "636 = LDAPS (encrypted LDAP)\n" +
      "1433 = SQL Server\n" +
      "3389 = RDP (Windows Remote Desktop)",
    azureConnection: "Every NSG rule you write in Azure is fundamentally a statement about protocol (TCP/UDP), port, source, and destination — this is the exact vocabulary those rules speak. When troubleshooting 'why can't I RDP into this VM,' recognizing that RDP means TCP 3389 lets you go straight to the NSG rule or OS firewall setting responsible, instead of guessing.",
    commonMistakes: [
      "Trying to memorize ports as a random list instead of connecting them to a service you already understand (e.g., 443 = the padlock icon in a browser).",
      "Assuming a service always uses TCP or always uses UDP — DNS, notably, uses UDP for regular lookups but TCP for larger transfers like zone transfers.",
      "Forgetting that blocking a port blocks the service, not the whole device — a VM can still be reachable on 443 while 3389 is completely blocked.",
    ],
    traps: [
      "Port 80 and port 443 are different protocols entirely (HTTP vs. HTTPS) even though they're 'both websites' — an NSG rule allowing one does not allow the other.",
      "Telnet (port 23) sends everything unencrypted, including passwords — recognizing it as a security risk, not just \"an old protocol,\" matters for real troubleshooting and security reviews.",
    ],
    remember: "TCP = reliable, handshake, used when it must arrive correctly. UDP = fast, no handshake, used when speed beats perfection. Learn the port table — it's the vocabulary of every firewall and NSG rule you'll ever write.",
    relatedLab: null,
    knowledgeCheck: [
      {
        question: "Which protocol is used for RDP (Windows Remote Desktop)?",
        options: ["TCP port 3389", "UDP port 3389", "TCP port 443", "TCP port 22"],
        answer: "TCP port 3389",
        explanation: "RDP uses TCP port 3389 by default.",
      },
      {
        question: "Why does DNS typically use UDP for regular lookups?",
        options: ["Speed matters more than guaranteed delivery for a quick lookup", "UDP is more secure than TCP", "DNS cannot use TCP at all", "UDP guarantees delivery better than TCP"],
        answer: "Speed matters more than guaranteed delivery for a quick lookup",
        explanation: "UDP's lower overhead suits DNS's typically small, latency-sensitive queries; DNS does fall back to TCP for larger responses.",
      },
    ],
  },
  {
    id: "netfund-devices-osi",
    topic: "netfund",
    domain: "Networking Fundamentals",
    title: "Network Devices, and the OSI / TCP-IP Models",
    examLevel: "career",
    summary: "Learn what switches, routers, firewalls, and load balancers actually do, and use the OSI model as a practical troubleshooting map.",
    plain: "A switch connects devices within one local network. A router connects different networks together. A firewall decides what traffic is allowed. A load balancer spreads traffic across multiple servers. The OSI model is just a shared vocabulary for describing which 'layer' of networking a problem lives at.",
    why: "When something breaks, the fastest engineers don't guess randomly — they mentally walk through layers (physical connection? addressing? routing? the application itself?) in order. That habit is worth more than memorizing device definitions on their own.",
    analogy: "A switch is like the hallway connecting rooms on the same floor of a building. A router is the elevator that connects different floors (different networks) together. A firewall is a security guard checking IDs at a door. A load balancer is a host at a restaurant entrance directing each new customer to whichever open table (server) is ready next.",
    diagram:
      "  OSI Model (top = closest to the user, bottom = closest to the wire)\n" +
      "  7 Application   <- HTTP, HTTPS, DNS, RDP (\"the app itself\")\n" +
      "  6 Presentation  <- encryption/formatting (often folded into App layer today)\n" +
      "  5 Session       <- managing a conversation between two devices\n" +
      "  4 Transport     <- TCP / UDP, port numbers\n" +
      "  3 Network       <- IP addresses, routers, routing\n" +
      "  2 Data Link     <- MAC addresses, switches\n" +
      "  1 Physical      <- cables, Wi-Fi signal, physical ports\n",
    terminology: [
      { term: "Switch", definition: "A Layer 2 device that connects devices within one local network, forwarding traffic based on MAC address." },
      { term: "Router", definition: "A Layer 3 device that connects different networks together, forwarding traffic based on IP address." },
      { term: "Firewall", definition: "A device or service that allows or denies traffic based on rules — source, destination, port, protocol." },
      { term: "Load balancer", definition: "A device or service that distributes incoming traffic across multiple backend servers." },
      { term: "Proxy", definition: "A device or service that sits between clients and servers, forwarding requests on a client's behalf — often used for caching, filtering, or hiding client identity." },
      { term: "OSI model", definition: "A 7-layer conceptual model describing how network communication is broken into stages, from physical cabling up to the application itself." },
    ],
    points: [
      "A switch operates within one network and uses MAC addresses; a router connects separate networks and uses IP addresses.",
      "Wireless access points extend a wired network to Wi-Fi clients — functionally similar to a switch, just over radio instead of cable.",
      "A firewall's job is permission (should this traffic be allowed?), distinct from a router's job (what path should this traffic take?).",
      "A load balancer's job is distribution — spreading client requests across multiple healthy backend servers so no single server is overwhelmed.",
      "The OSI model is a troubleshooting map more than a memorization exercise: 'is it physical (cable unplugged)? addressing (wrong IP)? routing (wrong gateway)? or application (wrong password)?'",
    ],
    distinctions: [
      { a: "Switch", b: "Router", note: "A switch forwards traffic within one local network using MAC addresses (Layer 2). A router forwards traffic between different networks using IP addresses (Layer 3). Most 'home routers' are actually both devices combined into one box." },
      { a: "Firewall", b: "Router", note: "A router decides the path traffic takes to its destination. A firewall decides whether that traffic is allowed at all. A router can technically forward traffic a firewall would otherwise block — they answer different questions." },
    ],
    scenario: "A user can print to a printer on the same office floor (switch handles that — same network) but cannot reach a file server in a different building on the company WAN. The router connecting the two locations, or its configuration, is the more likely place to look.",
    realWorldExample: "An application team reports 'our web app is slow under load.' Instead of guessing, an engineer checks: is the load balancer distributing traffic evenly across all backend servers, or is one server getting overloaded because a health probe incorrectly marked the others as unhealthy? This is a load-balancer-layer question, not a code problem — recognizing that saves hours of misdirected investigation.",
    azureConnection: "Azure Load Balancer and Application Gateway are the cloud equivalents of a physical load balancer. Azure NSGs and Azure Firewall are the cloud equivalents of a firewall. A VNet's routing behavior (system routes and UDRs) plays the router's role. The OSI-layer troubleshooting habit taught here maps directly onto the DNS → route → NSG → destination-service order used throughout the Azure networking lessons later in this app.",
    commonMistakes: [
      "Trying to memorize all 7 OSI layers as trivia instead of using the model as a practical 'which layer could this problem be at' checklist.",
      "Assuming a firewall and a router are the same device just because a single box in a small office often performs both roles.",
      "Blaming an application for a slow experience before ruling out a load-balancing or network-layer cause.",
    ],
    traps: [
      "A wireless access point is not the same thing as a router — it extends network access over Wi-Fi, but something else (often the same physical box) still handles routing.",
      "Layer numbers are often quoted in real conversations ('that's a Layer 3 problem') — recognizing that Layer 3 means IP/routing and Layer 2 means MAC/switching will help you follow real troubleshooting discussions.",
    ],
    remember: "Switch = same network, MAC-based. Router = between networks, IP-based. Firewall = permission. Load balancer = distribution. OSI model = a troubleshooting map, bottom (cable) to top (application).",
    relatedLab: null,
    knowledgeCheck: [
      {
        question: "Which device connects two different networks together using IP addresses?",
        options: ["A router", "A switch"],
        answer: "A router",
        explanation: "Routers operate at Layer 3 (IP) and connect separate networks; switches operate at Layer 2 (MAC) within one network.",
      },
      {
        question: "A firewall's core job is to decide...",
        options: ["Whether traffic is allowed", "Which path traffic takes", "How to distribute traffic across servers", "Which IP address a device receives"],
        answer: "Whether traffic is allowed",
        explanation: "Permission (allow/deny) is the firewall's job; routing decides the path, and load balancing decides distribution.",
      },
    ],
  },
  {
    id: "netfund-routing",
    topic: "netfund",
    domain: "Networking Fundamentals",
    title: "Routing and Routing Tables",
    examLevel: "career",
    summary: "Learn how a router decides where to send a packet next, using a routing table and the concept of a next hop.",
    plain: "A routing table is just a list of rules a router (or a VM's own network stack) uses to decide, for any given destination, which direction to send traffic next. That 'next direction' is called the next hop — it's rarely the final destination itself, just the next step on the way there.",
    why: "Every time traffic doesn't end up where you expect, a routing table is one of the first places to look. Understanding next-hop thinking is what lets you read an Azure route table (or a UDR) and immediately understand what it will actually do to traffic.",
    analogy: "A routing table is like a signpost at a highway interchange: it doesn't tell you the entire rest of your journey, just which exit to take right now to get closer to your destination. Every router along the path makes its own next, local decision the same way, and together those decisions get the packet all the way there.",
    diagram:
      "  [Laptop] -> [Local Router] -> [ISP Router] -> [Internet Backbone] -> [Destination's Router] -> [Server]\n" +
      "     Each hop only knows its own \"next direction,\" not the whole path.\n",
    terminology: [
      { term: "Routing table", definition: "A list of known destination networks and the next hop to use for each, kept by a router or a device's own network stack." },
      { term: "Route", definition: "One entry in a routing table: a destination network plus the next hop to reach it." },
      { term: "Next hop", definition: "The very next device traffic should be forwarded to on its way toward a destination — not the final destination itself." },
      { term: "Default route", definition: "The 'catch-all' route (0.0.0.0/0) used when no more specific route matches a destination — typically pointing toward the internet." },
      { term: "Static route", definition: "A route manually configured by an administrator." },
      { term: "Dynamic routing", definition: "Routers automatically learning and sharing routes with each other using a routing protocol, rather than an administrator configuring every route by hand — common in large enterprise/ISP networks, conceptually good to recognize even if you won't configure it directly as a Cloud Engineer." },
      { term: "Longest prefix match", definition: "When multiple routes could match a destination, the router always uses the most specific (longest prefix / smallest range) one that matches." },
    ],
    points: [
      "A routing table answers one question per packet: 'for this destination, what's my next hop?'",
      "The default route (0.0.0.0/0) is the fallback used when nothing more specific matches — usually the way out to the internet.",
      "Longest prefix match means a specific route (like a /24) always wins over a broader route (like a /0 default route) for a destination that both could technically match.",
      "Static routes are simple and predictable but must be updated by hand; dynamic routing scales better for large, changing networks but adds complexity.",
      "A router only needs to know the next hop for a destination, not the entire remaining path — each router along the way repeats this same local decision.",
    ],
    scenario: "A company's routing table has a specific route for 10.20.0.0/16 pointing to a VPN connection, and a default route (0.0.0.0/0) pointing to the internet. Traffic to 10.20.5.10 uses the specific VPN route (longest prefix match), while traffic to any public website falls through to the default route.",
    realWorldExample: "A packet leaving your laptop to reach a website follows this general path: your laptop sends it to your default gateway (your home router), which forwards it to your ISP's router, which forwards it across the internet backbone through several more routers, until it eventually reaches a router local to the destination server, which delivers it over that final local network. No single router in that chain knows the entire path — each only knows its own next hop.",
    azureConnection: "An Azure VNet subnet has a default 'system route' table already built in (to the internet, to other subnets in the VNet, and so on). A User-Defined Route (UDR) is simply a static route you add yourself — for example, forcing all outbound traffic through a firewall appliance instead of straight to the internet. Reading a UDR is exactly the next-hop thinking this lesson teaches: 'for this destination range, send traffic to this next hop instead of the default.'",
    commonMistakes: [
      "Assuming a router needs to know the entire path to a destination — it only ever needs the next hop.",
      "Forgetting longest prefix match, and being surprised when a broad default route doesn't 'win' over a more specific configured route.",
      "Confusing a route (which decides the path) with a firewall rule (which decides permission) — a route can be perfectly correct while a firewall still blocks the traffic.",
    ],
    traps: [
      "A missing route for a destination doesn't necessarily mean total failure — many networks fall back to a default route rather than failing immediately, which can mask a subtly wrong path.",
      "\"Default route\" and \"default gateway\" describe closely related but not identical ideas — the default gateway is the actual next-hop address a device uses for its own default route.",
    ],
    remember: "A route only ever answers 'what's my next hop for this destination.' More specific routes always win over broader ones (longest prefix match). The default route is the fallback to everything else.",
    relatedLab: "netfund-lab-trace-a-packet",
    knowledgeCheck: [
      {
        question: "If a routing table has both a specific route for 10.20.0.0/16 and a default route (0.0.0.0/0), which one is used for traffic to 10.20.5.10?",
        options: ["The specific 10.20.0.0/16 route (longest prefix match)", "The default route, since it was likely configured first", "Both are used at the same time", "Neither — the traffic is dropped"],
        answer: "The specific 10.20.0.0/16 route (longest prefix match)",
        explanation: "Longest prefix match always favors the most specific matching route over a broader one.",
      },
      {
        question: "Does a router need to know the complete path to a destination?",
        options: ["No, only the next hop", "Yes, the entire path must be known in advance"],
        answer: "No, only the next hop",
        explanation: "Each router only decides its own next hop; the packet is forwarded hop by hop.",
      },
    ],
  },
  {
    id: "netfund-vlans-segmentation",
    topic: "netfund",
    domain: "Networking Fundamentals",
    title: "VLANs and Network Segmentation",
    examLevel: "career",
    summary: "Learn why organizations divide one physical network into multiple logical networks, and how that idea carries into the cloud.",
    plain: "A VLAN lets you take devices connected to the same physical switches and split them into separate logical networks, as if they were on entirely different pieces of hardware — for organization, performance, and especially security.",
    why: "Segmentation is one of the most important security and organizational habits in all of networking — 'don't put everything on one flat network' is a lesson learned from decades of real incidents, and it directly explains why Azure VNets are always divided into subnets rather than left as one giant flat space.",
    analogy: "Imagine one large office building (one physical network) where every department shares the same open floor. A VLAN is like building actual walls and separate doors between departments — Finance, HR, and Engineering are still in the same building on the same wiring, but traffic (and problems) in one department's space can't spill directly into another's without going through a controlled doorway (a router or Layer 3 device).",
    diagram:
      "  Physical switch (one piece of hardware)\n" +
      "  Port 1-4:  VLAN 10 (Finance)   \\\n" +
      "  Port 5-8:  VLAN 20 (Engineering) }-- separated logically, same physical switch\n" +
      "  Port 9-12: VLAN 30 (Guest Wi-Fi) /\n",
    terminology: [
      { term: "VLAN (Virtual LAN)", definition: "A logical grouping of devices that behaves like its own separate network, even when sharing the same physical switching hardware." },
      { term: "Broadcast domain", definition: "The set of devices that receive each other's broadcast traffic — a VLAN creates a separate, smaller broadcast domain." },
      { term: "Segmentation", definition: "The general practice of dividing a network into smaller, isolated pieces for security, performance, or organizational reasons." },
      { term: "Trunk port", definition: "A switch port configured to carry traffic for multiple VLANs at once, typically used for links between switches." },
      { term: "Access port", definition: "A switch port assigned to exactly one VLAN, typically used to connect an end device like a PC." },
    ],
    points: [
      "VLANs let one physical switch behave like several separate logical switches.",
      "Devices in different VLANs cannot talk to each other directly — traffic between VLANs must pass through a router or Layer 3 device, exactly like traffic between two entirely separate networks.",
      "Smaller broadcast domains (achieved through VLANs) mean less unnecessary traffic and less chance for a problem in one segment to affect another.",
      "Segmentation is a core security practice: a compromised guest Wi-Fi device on its own VLAN can't directly reach sensitive servers on a separate VLAN.",
      "Trunk ports carry multiple VLANs' traffic (tagged so the switches know which VLAN each frame belongs to); access ports connect end devices to exactly one VLAN.",
    ],
    distinctions: [
      { a: "VLAN", b: "Azure VNet/subnet", note: "They solve a similar problem (segmentation) but are not the same technology. A VLAN segments a shared physical switching fabric using tags. An Azure VNet is a software-defined private network in the cloud, and its subnets are simply address-range divisions within it — there's no physical switch being logically split. The conceptual goal (isolate and organize traffic) is the same; the underlying mechanism is different." },
    ],
    scenario: "An organization puts its guest Wi-Fi network on a separate VLAN from its corporate network. A guest's malware-infected laptop generates suspicious traffic, but because it's isolated on the guest VLAN, it has no direct path to reach internal file servers or corporate workstations.",
    realWorldExample: "A retail company puts point-of-sale registers on their own VLAN, separate from the general office network and separate again from guest Wi-Fi. This isn't just tidiness — payment-card security standards often explicitly require exactly this kind of network segmentation.",
    azureConnection: "Azure VNets and subnets achieve a similar segmentation goal to VLANs, but in software rather than by tagging physical switch ports — this is why the lesson on VNets and subnets emphasizes that subnets are separated by NSGs and routing, not by any physical hardware. When you hear a real engineer say 'we should put that on its own subnet,' they're applying the exact same segmentation instinct this VLAN lesson is teaching, just in the cloud.",
    commonMistakes: [
      "Assuming devices on different VLANs can reach each other automatically just because they're on the same physical switch — they cannot, without a router.",
      "Treating VLANs and Azure subnets as literally the same technology, rather than two different tools solving a similar segmentation problem.",
      "Underestimating segmentation as 'just organization' rather than recognizing it as a genuine, often-required security control.",
    ],
    traps: [
      "A trunk port carries multiple VLANs, but that does not mean devices on those VLANs can talk to each other through it — the switches use tagging just to keep the traffic organized and separated, not to merge it.",
      "Two devices with IP addresses in the 'same-looking' range can still be on different VLANs (and therefore unable to talk without routing) if the network was configured that way — VLAN membership, not just IP addressing, determines this.",
    ],
    remember: "A VLAN turns one physical network into several logical ones. Devices in different VLANs need a router to talk to each other, just like devices on entirely separate physical networks would.",
    relatedLab: null,
    knowledgeCheck: [
      {
        question: "Can two devices on different VLANs communicate directly without a router?",
        options: ["No, they need a router or Layer 3 device", "Yes, VLANs don't affect direct communication"],
        answer: "No, they need a router or Layer 3 device",
        explanation: "Different VLANs are treated as separate networks, requiring routing to communicate, just like physically separate networks.",
      },
      {
        question: "Is an Azure VNet subnet literally the same technology as a VLAN?",
        options: ["No — similar goal (segmentation), different underlying mechanism", "Yes, they are identical technologies"],
        answer: "No — similar goal (segmentation), different underlying mechanism",
        explanation: "VLANs segment physical switching hardware with tags; Azure subnets are software-defined address divisions within a VNet.",
      },
    ],
  },
  {
    id: "netfund-firewalls-security",
    topic: "netfund",
    domain: "Networking Fundamentals",
    title: "Firewalls and Network Security Fundamentals",
    examLevel: "career",
    summary: "Learn how firewall rules actually work, and practice a real step-by-step approach to a classic 'can't connect' problem.",
    plain: "A firewall looks at traffic trying to cross a boundary and decides, based on rules, whether to allow or deny it. Every rule is built from the same handful of ingredients: which direction (inbound/outbound), what source, what destination, what protocol, and what port.",
    why: "Firewall (and NSG) rules are involved in an enormous share of real connectivity tickets, and writing or reading one badly is one of the most common junior-engineer mistakes. A clear mental model here pays off immediately.",
    analogy: "A firewall is a security guard at a building's entrance with a very specific rulebook: 'people from Marketing (source) can enter the Server Room door (destination) between 9-5 (a rule condition) if they're delivering paperwork (protocol/port), otherwise turn them away.' Change any one of those details and the guard's decision could flip.",
    diagram:
      "  Inbound rule example:\n" +
      "  Source: Internet (Any)  --->  [FIREWALL: Allow? Deny?]  --->  Destination: Web server, port 443\n" +
      "  Outbound rule example:\n" +
      "  Source: Internal PC     --->  [FIREWALL: Allow? Deny?]  --->  Destination: Internet, port 443\n",
    terminology: [
      { term: "Inbound traffic", definition: "Traffic coming into a network or device from outside it." },
      { term: "Outbound traffic", definition: "Traffic leaving a network or device, headed elsewhere." },
      { term: "Allow/deny rule", definition: "A firewall rule's action: permit the matching traffic through, or block it." },
      { term: "Stateful firewall", definition: "A firewall that remembers established connections, automatically allowing return traffic for a connection it already permitted outbound, without needing a separate matching inbound rule." },
      { term: "Least privilege (networking)", definition: "Only opening the specific source, destination, protocol, and port actually required — nothing broader." },
    ],
    points: [
      "Every firewall rule is built from the same five ingredients: direction, source, destination, protocol, and port.",
      "Most modern firewalls (including Azure NSGs) are stateful: allow outbound traffic once, and the matching inbound reply is automatically allowed back in without a separate rule.",
      "Least privilege means allowing exactly the traffic required and nothing more — 'allow any/any' rules are a common and serious security mistake.",
      "A firewall answers permission ('is this allowed?'); it does not decide the path traffic takes (that's routing) or resolve names (that's DNS).",
      "Rule order and specificity matter — a broad early rule can accidentally override a more specific one, depending on how a given firewall evaluates its rule list.",
    ],
    scenario: "A VM responds fine to other devices on its own local network, but a specific remote administrator cannot RDP into it from across the office. Walking the layers in order: is the VM's IP/subnet correct? Is there a route to reach it? Does the firewall (or NSG) allow inbound TCP 3389 from the administrator's source? Does the VM's own OS firewall also allow it? Is the Remote Desktop service actually running? Are the credentials correct?",
    realWorldExample:
      "A real troubleshooting walk-through for \"can't RDP into a VM\":\n" +
      "1. Confirm the VM's IP address and that it's on the expected subnet.\n" +
      "2. Confirm there's a valid route between the administrator's network and the VM's network.\n" +
      "3. Check the network-level firewall/NSG for an inbound rule allowing TCP 3389 from the administrator's source.\n" +
      "4. Check the VM's own operating-system firewall — a network rule can be perfectly correct while the OS firewall still blocks it locally.\n" +
      "5. Confirm the Remote Desktop service itself is running on the VM.\n" +
      "6. Finally, confirm the credentials being used are actually valid.\n" +
      "Working in this order (network outward-in, then local, then application, then identity) avoids wasted effort chasing the wrong layer first.",
    azureConnection: "This exact six-step order — IP/subnet, route, NSG, OS firewall, service, credentials — is the backbone of the AZ-104 networking troubleshooting lesson later in this app, just with 'NSG' as Azure's specific implementation of a network firewall rule. Recognizing this pattern here, in plain networking terms, is what makes the Azure-specific version feel obvious instead of new.",
    commonMistakes: [
      "Jumping straight to 'the firewall is broken' without confirming basic IP connectivity and routing first.",
      "Forgetting that a network-level firewall/NSG and a device's own OS firewall are two separate checks — both must allow the traffic.",
      "Writing overly broad allow rules (any source, any port) instead of the specific rule actually required, violating least privilege.",
    ],
    traps: [
      "A stateful firewall only auto-allows return traffic for connections it saw initiated — it does not mean all inbound traffic is allowed.",
      "\"The firewall isn't blocking anything\" is often wrong because there are two firewalls to check (network-level and OS-level), not one.",
    ],
    remember: "Every firewall rule = direction + source + destination + protocol + port. Stateful firewalls auto-allow replies to connections they already permitted. When troubleshooting, work outside-in: network path, then network firewall, then OS firewall, then the service itself, then credentials.",
    relatedLab: "netfund-lab-diagnose-local-network",
    knowledgeCheck: [
      {
        question: "What are the five core ingredients of any firewall rule?",
        options: ["Direction, source, destination, protocol, port", "Username, password, IP, MAC, VLAN", "Speed, latency, bandwidth, jitter, loss", "DNS, DHCP, NAT, ARP, ICMP"],
        answer: "Direction, source, destination, protocol, port",
        explanation: "These five elements define what a firewall rule actually matches and controls.",
      },
      {
        question: "A stateful firewall allowed an outbound connection. Does the matching inbound reply need its own separate rule?",
        options: ["No — stateful firewalls automatically allow the established reply", "Yes, every direction always needs its own rule"],
        answer: "No — stateful firewalls automatically allow the established reply",
        explanation: "Statefulness means the firewall tracks the connection and automatically permits its return traffic.",
      },
    ],
  },
  {
    id: "netfund-vpn-private-connectivity",
    topic: "netfund",
    domain: "Networking Fundamentals",
    title: "VPN and Private Connectivity Fundamentals",
    examLevel: "career",
    summary: "Learn how a VPN creates a private, encrypted path across a public network, and the difference between the two most common VPN patterns.",
    plain: "A VPN creates a private, encrypted tunnel across a public network (usually the internet), so two networks — or a single device and a network — can communicate as if they had a direct private connection, even though their traffic is actually crossing the public internet.",
    why: "Hybrid connectivity (connecting an on-premises office network to the cloud) is one of the most common real Cloud Engineer responsibilities, and it almost always starts with, or is compared against, a VPN.",
    analogy: "The public internet is like a busy public highway system — anyone can see the cars on it. A VPN is like putting your car inside an armored, opaque tunnel that runs alongside that same highway: you're still using the same roads to get where you're going, but nobody outside the tunnel can see or tamper with what's inside.",
    diagram:
      "  Site-to-Site VPN:\n" +
      "  [Office Network] ===encrypted tunnel=== [Cloud/Other Office Network]\n" +
      "\n" +
      "  Point-to-Site VPN:\n" +
      "  [Single laptop] ===encrypted tunnel=== [Office/Cloud Network]\n",
    terminology: [
      { term: "VPN (Virtual Private Network)", definition: "A technology that creates an encrypted, private-feeling connection across a public network like the internet." },
      { term: "Site-to-site VPN", definition: "A VPN connecting two entire networks (like an office and a cloud VNet) together, so devices on both sides can reach each other." },
      { term: "Point-to-site VPN", definition: "A VPN connecting a single device (like a remote employee's laptop) into a network, rather than connecting two whole networks." },
      { term: "IPsec", definition: "A common suite of protocols used to encrypt and authenticate VPN traffic." },
      { term: "Tunneling", definition: "Wrapping one network's traffic inside another protocol so it can travel across a network (like the internet) it wouldn't normally be routable on." },
      { term: "Hybrid networking", definition: "A network design that connects on-premises infrastructure and cloud infrastructure together as one logical environment." },
    ],
    points: [
      "A site-to-site VPN permanently connects two networks (e.g., a company office and a cloud VNet) so any device on either side can reach the other, subject to routing and firewall rules.",
      "A point-to-site VPN connects one individual device into a network — the classic 'remote worker VPN client' scenario.",
      "IPsec is the most common underlying technology that actually encrypts and authenticates VPN traffic.",
      "A VPN uses the existing public internet as its transport — it doesn't require new dedicated physical lines, which makes it fast to set up and relatively inexpensive.",
      "Hybrid networking (on-premises plus cloud, connected together) very often starts with a VPN, though larger organizations sometimes upgrade to a dedicated private connection for more consistent performance (the Azure bridge lesson covers this trade-off).",
    ],
    distinctions: [
      { a: "Site-to-site VPN", b: "Point-to-site VPN", note: "Site-to-site connects two entire networks together permanently — useful for an office-to-cloud connection everyone in the office benefits from. Point-to-site connects one individual device — useful for an individual remote worker who needs to reach the private network from wherever they are." },
    ],
    scenario: "A company's headquarters network needs constant, always-on connectivity to its Azure VNet so every on-premises server and workstation can reach cloud resources as if they were local. A site-to-site VPN (or a dedicated connection, covered next) fits this need, versus a single remote employee occasionally needing access, which fits a point-to-site VPN instead.",
    realWorldExample: "A company sets up a site-to-site VPN between its office and its Azure VNet so its on-premises file server backup jobs can reach an Azure storage account every night. Separately, their traveling sales staff use a point-to-site VPN client on their laptops so each of them, individually, can securely reach internal resources from hotel Wi-Fi.",
    azureConnection: "Azure VPN Gateway is the Azure resource that terminates both site-to-site and point-to-site VPN connections into a VNet. For organizations that need more consistent, higher-bandwidth private connectivity than a VPN over the public internet can reliably offer, Azure ExpressRoute provides a dedicated, non-internet connection instead — both are covered in more detail in the Azure Networking bridge lesson, since they sit slightly beyond what AZ-104 measures in depth but are core real-world Cloud Engineer knowledge.",
    commonMistakes: [
      "Assuming a VPN is a special separate physical network — it's actually still traveling over the regular public internet, just encrypted.",
      "Using a site-to-site VPN design for a problem that's really about individual remote users (point-to-site fits better), or vice versa.",
      "Forgetting that VPN performance is still subject to the underlying public internet's congestion and reliability, since no new dedicated path is created.",
      "Assuming a VPN tunnel by itself guarantees the two sides can actually talk — if both networks use overlapping IP address ranges (for example, both using 192.168.1.0/24), traffic can't be routed correctly across the tunnel even though the tunnel itself is up.",
    ],
    traps: [
      "A working VPN tunnel does not automatically mean every device on both sides can reach every other device — routing and firewall/NSG rules still apply on top of the VPN connection.",
      "VPN and 'private network' are not the same claim as 'fast' or 'guaranteed bandwidth' — it rides on the shared public internet underneath.",
      "The tunnel showing 'connected' does not mean traffic will flow — overlapping address spaces on the two sides is a classic cause of a VPN that connects but never passes traffic (the same underlying problem that breaks VNet peering).",
    ],
    remember: "Site-to-site VPN connects two whole networks. Point-to-site VPN connects one device into a network. Both encrypt traffic across the public internet using IPsec, rather than requiring new dedicated physical lines.",
    relatedLab: null,
    knowledgeCheck: [
      {
        question: "A traveling employee needs to securely reach internal company resources from their laptop while on the road. Which fits best?",
        options: ["Point-to-site VPN", "Site-to-site VPN"],
        answer: "Point-to-site VPN",
        explanation: "Point-to-site connects one individual device, which matches a single traveling employee's need.",
      },
      {
        question: "Does a VPN use a special, separate physical connection instead of the public internet?",
        options: ["No — it encrypts traffic that still travels over the existing public internet", "Yes, VPNs always require new dedicated physical lines"],
        answer: "No — it encrypts traffic that still travels over the existing public internet",
        explanation: "VPNs create an encrypted tunnel across the existing public internet rather than requiring new physical infrastructure.",
      },
    ],
  },
  {
    id: "netfund-bridge-to-azure",
    topic: "netfund",
    domain: "Networking Fundamentals",
    title: "From Networking Fundamentals to Azure",
    examLevel: "career",
    summary: "See every fundamental concept from this track mapped directly onto its Azure networking equivalent, plus a first look at a few real-world Azure networking services beyond AZ-104's core scope.",
    plain: "Nothing you just learned gets thrown away in Azure — it gets a new name and a portal blade. This lesson is the direct map from 'traditional networking word' to 'Azure networking word,' so the rest of this app's Azure Networking lessons feel like a vocabulary lesson, not a brand-new subject.",
    why: "This is the single most valuable lesson for confidence: it proves that everything you struggled through in this track — subnetting, routing, firewalls, VPNs — was not a detour before the 'real' Azure content. It was the real content, just without a portal screenshot yet.",
    analogy: "Think of this lesson like a phrasebook when you first visit a country where they speak a related-but-different language to your own: the concepts translate almost word for word, once you know the mapping.",
    terminology: [
      { term: "Azure Firewall", definition: "A managed, cloud-native firewall service for filtering traffic at a VNet or hub level — a more centralized, feature-rich alternative to NSGs for larger environments." },
      { term: "NAT Gateway", definition: "A managed Azure resource providing predictable, scalable outbound internet connectivity (NAT/PAT) for resources in a subnet." },
      { term: "Application Gateway", definition: "A Layer 7 (application-aware) load balancer that can make routing decisions based on URL path or hostname, and can host a Web Application Firewall." },
      { term: "Web Application Firewall (WAF)", definition: "A firewall specifically designed to protect web applications from common web-based attacks, often deployed as a feature of Application Gateway." },
      { term: "ExpressRoute", definition: "A dedicated, private connection between an on-premises network and Azure that does not travel over the public internet, used when a VPN's performance/reliability profile isn't sufficient." },
    ],
    points: [
      "This lesson is a map, not new material — every row connects something you already understand to its Azure name.",
      "Azure Firewall, Application Gateway/WAF, ExpressRoute, and NAT Gateway are real, important Azure services that go beyond what AZ-104 measures in depth — worth knowing conceptually for real Cloud Engineer work and for context on more advanced certifications like AZ-700.",
      "AZ-104's Virtual Networking domain focuses on VNets, subnets, NSGs, peering, UDRs, Bastion, service/private endpoints, DNS, and Load Balancer — all of which this track has now given you a real foundation for.",
    ],
    distinctions: [
      { a: "Fundamental concept", b: "Azure equivalent" },
    ],
    realWorldExample:
      "The direct translation table:\n" +
      "Network (LAN) → Virtual Network (VNet)\n" +
      "Subnet/VLAN segment → Subnet\n" +
      "NIC → Network Interface (NIC resource)\n" +
      "Public/private IP → Public IP / Private IP resource\n" +
      "Default gateway / routing table → System routes / Route Table (UDR)\n" +
      "DNS server → Azure DNS / Azure Private DNS\n" +
      "DHCP → Automatic private IP assignment within a subnet\n" +
      "Firewall rule → Network Security Group (NSG) rule, or Azure Firewall for centralized filtering\n" +
      "NAT/PAT → Outbound connectivity via Load Balancer or NAT Gateway\n" +
      "Load balancer (Layer 4) → Azure Load Balancer\n" +
      "Load balancer (Layer 7, app-aware) → Application Gateway (+ optional WAF)\n" +
      "Site-to-site VPN → Azure VPN Gateway (site-to-site connection)\n" +
      "Point-to-site VPN → Azure VPN Gateway (point-to-site connection)\n" +
      "Dedicated private line (beyond VPN) → Azure ExpressRoute\n" +
      "Bastion host / jump box → Azure Bastion\n" +
      "\"Is this segment cut off from that one?\" → VNet peering (or the lack of it)",
    azureConnection: "From this point forward, every Azure Networking lesson in this app builds directly on this map. When those lessons say 'a route decides the path, an NSG decides permission,' that's the exact same routing-vs-firewall distinction from this track's routing and firewall lessons — just wearing an Azure name tag.",
    commonMistakes: [
      "Treating Azure networking as an entirely new subject instead of recognizing it as the same concepts with new resource names and a portal UI on top.",
      "Assuming ExpressRoute, Application Gateway, WAF, Azure Firewall, and NAT Gateway are AZ-104 exam requirements at the same depth as NSGs or VNets — they're valuable real-world knowledge, but the current AZ-104 objectives focus most heavily on the core VNet/NSG/Load Balancer/VPN Gateway set.",
    ],
    traps: [
      "Don't assume the Azure equivalent of a concept works in an identical, one-to-one way under the hood (VLAN vs. subnet is the clearest example already covered) — the mapping is about matching problems and concepts, not literal implementation.",
    ],
    examTips: [
      "When an AZ-104 practice question feels unfamiliar, try translating it back into plain networking terms using this map first — it usually turns an intimidating Azure question into a fundamentals question you already know how to answer.",
    ],
    remember: "Nothing in networking fundamentals was a detour — it's the same map, just with Azure's names on the streets. Use the translation table whenever an Azure networking term feels unfamiliar.",
    relatedLab: null,
    knowledgeCheck: [
      {
        question: "Which Azure service provides a dedicated, private connection to Azure that does not use the public internet at all?",
        options: ["ExpressRoute", "Site-to-site VPN", "NAT Gateway", "Application Gateway"],
        answer: "ExpressRoute",
        explanation: "ExpressRoute is a dedicated private connection, unlike a VPN which still travels over the public internet (encrypted).",
      },
      {
        question: "Which Azure service is the Layer 7, application-aware load balancer that can also host a Web Application Firewall?",
        options: ["Application Gateway", "Azure Load Balancer", "NAT Gateway", "Azure Bastion"],
        answer: "Application Gateway",
        explanation: "Application Gateway operates at Layer 7 and supports URL/host-based routing and an optional WAF; Azure Load Balancer is Layer 4.",
      },
    ],
  },
];
