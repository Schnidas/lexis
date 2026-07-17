export const BANK_A = [
  { id: "cogent", head: "cogent", pos: "adj.", core: "so clearly reasoned it compels agreement",
    members: [
      { w: "cogent", n: "persuasive through logic; the argument itself does the work" },
      { w: "compelling", n: "persuasive through force or urgency; can be emotional" },
      { w: "specious", n: "looks valid on the surface, is actually flawed" },
      { w: "tendentious", n: "argued with a hidden agenda; slanted from the start" },
    ],
    example: "The judges called the pitch cogent: every claim was backed by The Den's actual revenue data.",
    tip: "Call an argument cogent only when the logic is airtight. If it merely grabs attention, it is compelling." },

  { id: "pithy", head: "pithy", pos: "adj.", core: "brief and packed with meaning",
    members: [
      { w: "pithy", n: "short AND substantive; density is the point" },
      { w: "laconic", n: "using few words as a style or temperament" },
      { w: "terse", n: "brief to the point of seeming curt or cold" },
      { w: "succinct", n: "neutral: expressed clearly in few words" },
      { w: "prolix", n: "the opposite: tediously wordy" },
    ],
    example: "Cut the deck to one pithy line per slide; prolix slides lose judges in seconds.",
    tip: "Terse can offend. Pithy impresses. Choose deliberately." },

  { id: "lucid", head: "lucid", pos: "adj.", core: "expressed with complete clarity",
    members: [
      { w: "lucid", n: "clear and easy to follow" },
      { w: "opaque", n: "impossible to see into; unclear by nature or design" },
      { w: "obfuscate", n: "to deliberately make something unclear" },
      { w: "abstruse", n: "hard to understand because genuinely complex" },
      { w: "elide", n: "to skip over or omit, often conveniently" },
    ],
    example: "The API docs were so opaque I rewrote them into one lucid page for the Helix handoff file.",
    tip: "Obfuscate implies intent. Abstruse implies difficulty. Do not confuse malice with complexity." },

  { id: "castigate", head: "castigate", pos: "v.", core: "to criticize severely",
    members: [
      { w: "castigate", n: "harsh, punishing criticism" },
      { w: "excoriate", n: "even harsher; to verbally flay someone" },
      { w: "rebuke", n: "sharp disapproval, often from authority" },
      { w: "admonish", n: "gentle warning criticism; corrective, not cruel" },
      { w: "censure", n: "formal, official disapproval" },
    ],
    example: "The advisor didn't castigate the team; she admonished them to verify pull-rate data before publishing.",
    tip: "These form a ladder: admonish, rebuke, censure, castigate, excoriate. Pick your rung." },

  { id: "extol", head: "extol", pos: "v.", core: "to praise enthusiastically",
    members: [
      { w: "extol", n: "praise highly and publicly" },
      { w: "laud", n: "formal praise; often in writing" },
      { w: "commend", n: "measured, professional approval" },
      { w: "venerate", n: "praise elevated to reverence; near-worship" },
    ],
    example: "Collectors extol PSA 10 slabs, but the pop report decides whether the premium is deserved.",
    tip: "Commend is what a manager does. Extol is what a fan does. Venerate is what a disciple does." },

  { id: "mitigate", head: "mitigate", pos: "v.", core: "to make something bad less severe",
    members: [
      { w: "mitigate", n: "reduce severity of harm or risk" },
      { w: "temper", n: "moderate by adding a counterbalancing quality" },
      { w: "attenuate", n: "weaken or thin out gradually" },
      { w: "assuage", n: "soothe a feeling: fear, guilt, grief" },
      { w: "exacerbate", n: "the opposite: make worse" },
    ],
    example: "Caching the EPA data mitigates the risk of rate limits taking Helix down on launch day.",
    tip: "You mitigate risks, assuage fears, temper optimism. The verbs are not interchangeable." },

  { id: "nascent", head: "nascent", pos: "adj.", core: "just coming into existence",
    members: [
      { w: "nascent", n: "newly born and beginning to develop" },
      { w: "incipient", n: "at the very first stage; barely detectable yet" },
      { w: "embryonic", n: "formed but undeveloped; the plan exists in outline" },
      { w: "inchoate", n: "not yet fully formed; still vague and unstructured" },
    ],
    example: "The environmental-health app market is nascent: real demand, no dominant player yet.",
    tip: "Inchoate is the most negative of these; it implies disorganization, not just youth." },

  { id: "ubiquitous", head: "ubiquitous", pos: "adj.", core: "present everywhere at once",
    members: [
      { w: "ubiquitous", n: "found everywhere" },
      { w: "pervasive", n: "spread through every part of something, often unwelcome" },
      { w: "endemic", n: "native to and persistent in a particular place or group" },
      { w: "proliferate", n: "(v.) to multiply rapidly" },
    ],
    example: "QR menus became ubiquitous in two years; distribution, not quality, made them win.",
    tip: "Pervasive carries a faint smell. 'Pervasive doubt' works; 'pervasive joy' sounds off." },

  { id: "disingenuous", head: "disingenuous", pos: "adj.", core: "pretending to know less than you do; falsely naive",
    members: [
      { w: "disingenuous", n: "insincere while performing sincerity" },
      { w: "duplicitous", n: "actively two-faced; saying one thing, doing another" },
      { w: "feign", n: "(v.) to fake a feeling or state" },
      { w: "dissemble", n: "(v.) to hide your true motives behind a false front" },
    ],
    example: "Calling the fee 'a small processing cost' was disingenuous; it doubled the checkout price.",
    tip: "Disingenuous is the polite accusation. Duplicitous is the serious one." },

  { id: "candid", head: "candid", pos: "adj.", core: "honest and direct, even when it costs something",
    members: [
      { w: "candid", n: "truthful without polish" },
      { w: "forthright", n: "direct and immediate; no hedging" },
      { w: "frank", n: "blunt honesty, sometimes uncomfortably so" },
      { w: "guileless", n: "honest from innocence; incapable of scheming" },
    ],
    example: "Be candid with the first ten Helix users; flattery from them is worthless data.",
    tip: "Guileless describes character. The other three describe communication." },

  { id: "intransigent", head: "intransigent", pos: "adj.", core: "refusing to compromise",
    members: [
      { w: "intransigent", n: "unwilling to budge in negotiation; often political" },
      { w: "obstinate", n: "stubborn against reason" },
      { w: "obdurate", n: "hardened against persuasion or sympathy" },
      { w: "tenacious", n: "the positive cousin: holding firm with grit" },
    ],
    example: "Be tenacious about the vision and flexible on the roadmap; founders who are intransigent about both die.",
    tip: "Same behavior, different framing: your persistence is tenacious, theirs is obstinate." },

  { id: "mercurial", head: "mercurial", pos: "adj.", core: "prone to sudden unpredictable changes",
    members: [
      { w: "mercurial", n: "changeable in mood or behavior; lively but unstable" },
      { w: "volatile", n: "unstable and liable to erupt; used for markets and tempers" },
      { w: "capricious", n: "changing on whim, without reason" },
      { w: "protean", n: "the positive version: adaptable, taking many forms" },
    ],
    example: "Sealed product prices are volatile around set rotation; don't read one mercurial week as a trend.",
    tip: "Volatile is measurable. Capricious is a character flaw. Protean is a compliment." },

  { id: "meticulous", head: "meticulous", pos: "adj.", core: "showing extreme care over details",
    members: [
      { w: "meticulous", n: "precise and careful; the standard compliment" },
      { w: "fastidious", n: "hard to please; picky about details and cleanliness" },
      { w: "scrupulous", n: "careful specifically about ethics and correctness" },
      { w: "punctilious", n: "obsessive about rules, forms, and etiquette" },
    ],
    example: "TAG's meticulous scanning process is exactly why its subgrades carry weight with serious collectors.",
    tip: "A meticulous accountant is good. A scrupulous one won't cook the books. Different virtues." },

  { id: "cavalier", head: "cavalier", pos: "adj.", core: "showing a careless lack of concern",
    members: [
      { w: "cavalier", n: "dismissively casual about something serious" },
      { w: "negligent", n: "failing a duty of care; a legal-weight word" },
      { w: "remiss", n: "mildly negligent; 'I'd be remiss not to mention'" },
      { w: "slipshod", n: "carelessly done work; sloppy execution" },
    ],
    example: "Being cavalier about auth on a health app isn't a style choice, it's negligence waiting for a headline.",
    tip: "Cavalier describes attitude. Slipshod describes output. Negligent describes liability." },

  { id: "frugal", head: "frugal", pos: "adj.", core: "economical; careful with resources",
    members: [
      { w: "frugal", n: "spending carefully; a virtue" },
      { w: "parsimonious", n: "stingy past the point of virtue" },
      { w: "profligate", n: "recklessly wasteful with money" },
      { w: "prodigal", n: "wastefully extravagant; spending as identity" },
      { w: "lavish", n: "generously abundant; can be praise or critique" },
    ],
    example: "Stay frugal pre-revenue; profligate spending on tools you don't use is how runways vanish.",
    tip: "Frugal and parsimonious describe the same behavior; the second one is an insult." },

  { id: "lucrative", head: "lucrative", pos: "adj.", core: "producing significant profit",
    members: [
      { w: "lucrative", n: "profitable; describes the activity" },
      { w: "affluent", n: "wealthy; describes the person or area" },
      { w: "opulent", n: "displaying wealth visibly; lush and rich" },
      { w: "destitute", n: "the far opposite: lacking basic necessities" },
    ],
    example: "Grading arbitrage was lucrative in 2021; the question is whether that margin still exists after fees.",
    tip: "Activities are lucrative. People are affluent. Hotels are opulent." },

  { id: "ephemeral", head: "ephemeral", pos: "adj.", core: "lasting a very short time",
    members: [
      { w: "ephemeral", n: "short-lived by nature" },
      { w: "transient", n: "passing through; temporary presence" },
      { w: "fleeting", n: "gone almost as soon as noticed" },
      { w: "evanescent", n: "fading like vapor; poetic register" },
      { w: "perennial", n: "the opposite: recurring, enduring" },
    ],
    example: "Hype around a new set is ephemeral; pop reports and pull rates are what persist.",
    tip: "Evanescent is beautiful but fragile; save it for writing, not pitches." },

  { id: "atrophy", head: "atrophy", pos: "v.", core: "to waste away from disuse",
    members: [
      { w: "atrophy", n: "decline from lack of use; muscles, skills" },
      { w: "deteriorate", n: "get progressively worse; general purpose" },
      { w: "degrade", n: "reduce in quality or dignity" },
      { w: "ameliorate", n: "the opposite: to make better" },
    ],
    example: "Vocabulary atrophies exactly like muscle: not from forgetting, but from never being loaded.",
    tip: "Atrophy needs disuse as the cause. A neglected building deteriorates; it doesn't atrophy." },

  { id: "indignant", head: "indignant", pos: "adj.", core: "angry at unfairness",
    members: [
      { w: "indignant", n: "anger with a moral claim behind it" },
      { w: "incensed", n: "very angry; burning" },
      { w: "irate", n: "openly, loudly angry" },
      { w: "apoplectic", n: "so furious you can barely function" },
    ],
    example: "Customers weren't just annoyed by the surprise fee; they were indignant, and indignation drives refund demands.",
    tip: "Indignant is the useful one: it names anger that believes it is justified." },

];
