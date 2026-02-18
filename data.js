// data.js — edit this file only to add categories/items
// KEEP the variable names `PLACEHOLDER` and `DATA` as-is
// Format per item is consistent: id (string with category prefix), name, desc, tags, images { main, extras[3] }, story (narrative)
// Added: rarity (one of "S","A","B","C","D")

const PLACEHOLDER = "https://via.placeholder.com/1200x800/ffe9a8/333333?text=No+Image";

const DATA = {
  CHARACTER: {
    title: "Character",
    items: [
      {
        id: "A1",
        name: "Ice Queen",
        desc: "Frozen ruler of the north, graceful yet cold.",
        tags: ["ice", "legend"],
        rarity: "S",
        images: {
          main: "https://via.placeholder.com/1200x800/9ad0ff/04345b?text=Ice+Queen+Main",
          extras: [
            "https://via.placeholder.com/400x300/9ad0ff/04345b?text=Ice+Queen+1",
            "https://via.placeholder.com/400x300/cfe9ff/04345b?text=Ice+Queen+2",
            "https://via.placeholder.com/400x300/e6f7ff/04345b?text=Ice+Queen+3"
          ]
        },
        story: "The Ice Queen stands upon the northern ramparts, her cloak trailing frost in the wind. Once a mortal guardian of a forgotten glacier, she ascended into legend by binding her heart to an eternal winter. Her presence hushes the fiercest storms and her voice is said to chill the air; villagers tell of seeing blue light glimmer across the horizon when she rides to war. This portrait captures her quiet command — regal, distant, and impossibly still."
      },

      {
        id: "A2",
        name: "Shadow Blade",
        desc: "Stealth assassin from the eastern isles.",
        tags: ["stealth", "assassin"],
        rarity: "A",
        images: {
          main: "https://via.placeholder.com/1200x800/222831/ffffff?text=Shadow+Blade+Main",
          extras: [
            "https://via.placeholder.com/400x300/2b2f3a/ffffff?text=Shadow+1",
            "https://via.placeholder.com/400x300/343a40/ffffff?text=Shadow+2",
            "https://via.placeholder.com/400x300/495057/ffffff?text=Shadow+3"
          ]
        },
        story: "Shadow Blade moves like a whisper through the lantern-lit alleys of the eastern isles. Trained by an order of ghostly hunters, they strike without warning and vanish like smoke. The image series shows the assassin preparing a blade, blending into moonlit rooftops, and melting into the crowd — a study in silence and purpose. Legends say the Shadow Blade once spared a prince, changing the course of a war; others say that was only to mask a deeper plot."
      },

      {
        id: "A3",
        name: "Fire Knight",
        desc: "Blazing frontline tank, fearless and proud.",
        tags: ["fire", "tank"],
        rarity: "A",
        images: {
          main: "https://via.placeholder.com/1200x800/ff8a65/4e2a1f?text=Fire+Knight+Main",
          extras: [
            "https://via.placeholder.com/400x300/ff8a65/4e2a1f?text=Fire+1",
            "https://via.placeholder.com/400x300/ffccbc/4e2a1f?text=Fire+2",
            "https://via.placeholder.com/400x300/ffe0b2/4e2a1f?text=Fire+3"
          ]
        },
        story: "Forged in the heart of an active volcano, the Fire Knight bears armor scorched by ancient flames. He advances at the vanguard of battle, absorbing blows that would fell ordinary warriors and turning heat into a shield for his allies. The three-frame extras depict the knight's charge, the cooling of molten armor after an impact, and the moment he lifts his banner — an image of endurance and controlled fury."
      },

      {
        id: "A4",
        name: "Wind Archer",
        desc: "Swift sniper who dances on the breeze.",
        tags: ["wind", "ranged"],
        rarity: "B",
        images: {
          main: "https://via.placeholder.com/1200x800/b2f5ea/013220?text=Wind+Archer+Main",
          extras: [
            "https://via.placeholder.com/400x300/b2f5ea/013220?text=Wind+1",
            "https://via.placeholder.com/400x300/ccfff5/013220?text=Wind+2",
            "https://via.placeholder.com/400x300/e6fff8/013220?text=Wind+3"
          ]
        },
        story: "Perched on high cliffs, the Wind Archer uses thermals to glide between perches and rain down arrows with uncanny precision. The portrait captures her poised silhouette, the extras showing a rapid-fire volley, a silent tracking moment, and a final arrow released into twilight. Her legend speaks of saving entire caravans from ambush by felling the chief brigand in a single, impossible shot."
      },

      {
        id: "A5",
        name: "Holy Priest",
        desc: "Support healer, blessed with sacred light.",
        tags: ["support", "holy"],
        rarity: "B",
        images: {
          main: "https://via.placeholder.com/1200x800/fff8e1/6b4200?text=Holy+Priest+Main",
          extras: [
            "https://via.placeholder.com/400x300/fff8e1/6b4200?text=Holy+1",
            "https://via.placeholder.com/400x300/fff3cc/6b4200?text=Holy+2",
            "https://via.placeholder.com/400x300/fff1b5/6b4200?text=Holy+3"
          ]
        },
        story: "The Holy Priest tends to wounded troops beneath stained-glass domes, calling upon a gentle radiance that mends flesh and lifts spirits. In these images she is shown laying hands upon a fallen soldier, chanting beneath candlelight, and walking through a line of grateful villagers. Her story emphasizes compassion and the quiet power of faith — she heals not for glory, but because she cannot turn away."
      }
    ]
  },

  MONSTER: {
    title: "Monster",
    items: [
      {
        id: "B1",
        name: "Dark Dragon",
        desc: "Ancient beast of shadow and fury.",
        tags: ["dragon", "boss"],
        rarity: "S",
        images: {
          main: "https://via.placeholder.com/1200x800/6a1b9a/ffffff?text=Dark+Dragon+Main",
          extras: [
            PLACEHOLDER,
            PLACEHOLDER,
            PLACEHOLDER
          ]
        },
        story: "The Dark Dragon is a presence that warps the sky, a remnant of a cataclysm older than memory. Villages near its lair tell of nights when stars dim and a purple haze blankets the valley. The image series (main and placeholders) symbolizes its looming threat and the eerie silence before it strikes; scholars argue the dragon's shadow bends magic itself."
      },

      {
        id: "B2",
        name: "Goblin King",
        desc: "Cave ruler.",
        tags: ["goblin"],
        rarity: "C",
        images: {
          main: PLACEHOLDER,
          extras: [
            PLACEHOLDER,
            PLACEHOLDER,
            PLACEHOLDER
          ]
        },
        story: "The Goblin King rules a warren of tunnels lit by stolen lanterns and hung with trophies of raided caravans. He is cunning more than strong, smiling with too many teeth. The narrative frames him as a small but relentless threat — clever traps, ambush parties, and a throne of mismatched bones."
      },

      {
        id: "B3",
        name: "Ice Golem",
        desc: "Frozen tank.",
        tags: ["ice"],
        rarity: "B",
        images: {
          main: PLACEHOLDER,
          extras: [
            PLACEHOLDER,
            PLACEHOLDER,
            PLACEHOLDER
          ]
        },
        story: "Carved from glacial stone, the Ice Golem trudges forward, immovable and patient. Its surface cracks with ancient runes and it moves with the weight of time. The story explores its stoic nature: built by a lost civilization to guard sacred sites, long abandoned but still dutiful in its watch."
      },

      {
        id: "B4",
        name: "Fire Demon",
        desc: "Infernal terror.",
        tags: ["fire"],
        rarity: "A",
        images: {
          main: PLACEHOLDER,
          extras: [
            PLACEHOLDER,
            PLACEHOLDER,
            PLACEHOLDER
          ]
        },
        story: "The Fire Demon consumes all light around it, leaving scorched earth and whispers of heat. Its arrival is heralded by cinders and lightning-like sparks. In tales, it tests heroes' resolve, offering power for a price; its portrait is a study in chaos and temptation."
      },

      {
        id: "B5",
        name: "Void Reaper",
        desc: "Soul hunter.",
        tags: ["void"],
        rarity: "S",
        images: {
          main: PLACEHOLDER,
          extras: [
            PLACEHOLDER,
            PLACEHOLDER,
            PLACEHOLDER
          ]
        },
        story: "The Void Reaper slides between shadows and forgotten doors, collecting echoes and memories for a hungry void. Survivors speak of a cold silence where the Reaper passes and the feeling of a life half-remembered. This narrative focuses on dread and the slow pull of forgetfulness it brings."
      }
    ]
  },

  PET: {
    title: "Pet",
    items: [
      {
        id: "C1",
        name: "Mini Dragon",
        desc: "Tiny fire buddy.",
        tags: ["cute"],
        rarity: "C",
        images: {
          main: PLACEHOLDER,
          extras: [
            PLACEHOLDER,
            PLACEHOLDER,
            PLACEHOLDER
          ]
        },
        story: "Though small, the Mini Dragon is fierce in loyalty and quick to warm a cold campfire. Children dream of riding them; farmers keep them for luck. The portrait sequence evokes playfulness, mischief, and the surprising bravery of a tiny companion."
      },

      {
        id: "C2",
        name: "Snow Fox",
        desc: "Cute frost pet.",
        tags: ["cute", "ice"],
        rarity: "B",
        images: {
          main: PLACEHOLDER,
          extras: [
            PLACEHOLDER,
            PLACEHOLDER,
            PLACEHOLDER
          ]
        },
        story: "The Snow Fox leaves silver pawprints across frozen lakes and is often found sleeping atop curled-up travelers to lend warmth. In folk stories, they are guides for lost wanderers and guardians of winter flowers — a soft symbol of survival and companionship."
      },

      {
        id: "C3",
        name: "Thunder Cat",
        desc: "Electric kitty.",
        tags: ["electric"],
        rarity: "C",
        images: {
          main: PLACEHOLDER,
          extras: [
            PLACEHOLDER,
            PLACEHOLDER,
            PLACEHOLDER
          ]
        },
        story: "With crackling fur and bright eyes, the Thunder Cat purrs like a distant storm. Nomads use them to sense incoming weather, and their purrs can tingle the skin. This narrative captures whimsy and the small shocks that keep life interesting."
      },

      {
        id: "C4",
        name: "Spirit Wolf",
        desc: "Ghost companion.",
        tags: ["spirit"],
        rarity: "B",
        images: {
          main: PLACEHOLDER,
          extras: [
            PLACEHOLDER,
            PLACEHOLDER,
            PLACEHOLDER
          ]
        },
        story: "A Spirit Wolf follows those who listen to old songs, visible only in moonlight. It is a guide through memories and a protector against restless phantoms. The images suggest quiet loyalty and the thin line between this world and the next."
      },

      {
        id: "C5",
        name: "Fairy Sprite",
        desc: "Magic helper.",
        tags: ["magic"],
        rarity: "D",
        images: {
          main: PLACEHOLDER,
          extras: [
            PLACEHOLDER,
            PLACEHOLDER,
            PLACEHOLDER
          ]
        },
        story: "Tiny and luminous, the Fairy Sprite flutters through gardens and heals small wounds with moonlit dust. Farmers leave out sweet tea to encourage their visits. The narrative paints a picture of small mercies and the gentle hands of hidden helpers."
      }
    ]
  },

  AREA: {
    title: "Area",
    items: [
      {
        id: "D1",
        name: "Frozen Kingdom",
        desc: "Land of ice.",
        tags: ["ice", "zone"],
        rarity: "A",
        images: {
          main: PLACEHOLDER,
          extras: [
            PLACEHOLDER,
            PLACEHOLDER,
            PLACEHOLDER
          ]
        },
        story: "The Frozen Kingdom stretches to the horizon in blue-white dunes of snow. Old fortresses jut from the ice like teeth, and auroras crown the nights. The area is dangerous but beautiful; its images aim to show scale, silence, and the fragile settlements that cling to warmth."
      },

      {
        id: "D2",
        name: "Dark Forest",
        desc: "Mystic woods.",
        tags: ["forest"],
        rarity: "B",
        images: {
          main: PLACEHOLDER,
          extras: [
            PLACEHOLDER,
            PLACEHOLDER,
            PLACEHOLDER
          ]
        },
        story: "The Dark Forest hums with hidden life: bioluminescent fungi, ancient trees that remember names, and trails that shift when you're not looking. Travelers tell stories of being led home by strangers with lanterns — or led astray. The narrative explores wonder tinged with unease."
      },

      {
        id: "D3",
        name: "Sky City",
        desc: "Floating realm.",
        tags: ["sky"],
        rarity: "A",
        images: {
          main: PLACEHOLDER,
          extras: [
            PLACEHOLDER,
            PLACEHOLDER,
            PLACEHOLDER
          ]
        },
        story: "Spindly bridges and floating gardens define the Sky City, where wind-sail boats cross open air and music drifts on high gusts. The images convey a sense of vertigo and refinement — a civilization that turned gravity into art."
      },

      {
        id: "D4",
        name: "Lava Valley",
        desc: "Burning land.",
        tags: ["lava"],
        rarity: "C",
        images: {
          main: PLACEHOLDER,
          extras: [
            PLACEHOLDER,
            PLACEHOLDER,
            PLACEHOLDER
          ]
        },
        story: "Rivers of molten rock carve paths through blackened cliffs in the Lava Valley. Blacksmiths and fire-mages harvest the heat for creation, while the bravest test themselves in its crucible. The narrative focuses on raw energy and the harsh beauty of creation under pressure."
      },

      {
        id: "D5",
        name: "Sacred Temple",
        desc: "Ancient shrine.",
        tags: ["holy"],
        rarity: "B",
        images: {
          main: PLACEHOLDER,
          extras: [
            PLACEHOLDER,
            PLACEHOLDER,
            PLACEHOLDER
          ]
        },
        story: "Built on a cliffside, the Sacred Temple is a place of pilgrimage and quiet judgment. Pilgrims leave offerings and whisper confessions beneath painted domes. Visuals emphasize ritual, worn stone, and moments of private revelation."
      }
    ]
  },

  MAGIC: {
    title: "Magic",
    items: [
      {
        id: "E1",
        name: "Ice Meteor",
        desc: "Frozen blast.",
        tags: ["ice", "aoe"],
        rarity: "A",
        images: {
          main: PLACEHOLDER,
          extras: [
            PLACEHOLDER,
            PLACEHOLDER,
            PLACEHOLDER
          ]
        },
        story: "Ice Meteor rends the sky and strikes the earth, leaving craters rimed with frost. Mages study its shards for power and danger alike. These images frame the event's magnitude — a single bright strike that reshapes a battlefield."
      },

      {
        id: "E2",
        name: "Dark Flame",
        desc: "Cursed fire.",
        tags: ["fire", "dot"],
        rarity: "B",
        images: {
          main: PLACEHOLDER,
          extras: [
            PLACEHOLDER,
            PLACEHOLDER,
            PLACEHOLDER
          ]
        },
        story: "Dark Flame consumes yet corrupts — a slow burn that withers rather than incinerates. Apocalyptic tales link it to bargains gone wrong. The narrative explores temptation and cost, a reminder that some flames warm only to destroy."
      },

      {
        id: "E3",
        name: "Wind Slash",
        desc: "Air blade.",
        tags: ["wind"],
        rarity: "C",
        images: {
          main: PLACEHOLDER,
          extras: [
            PLACEHOLDER,
            PLACEHOLDER,
            PLACEHOLDER
          ]
        },
        story: "Wind Slash cleaves air with the sound of a bell; swift and elegant, it slices through armor like a cold whisper. Duelists prize the technique as much as they fear it. The images are studies of motion and the quiet geometry of a perfect strike."
      },

      {
        id: "E4",
        name: "Holy Light",
        desc: "Sacred beam.",
        tags: ["holy", "single"],
        rarity: "B",
        images: {
          main: PLACEHOLDER,
          extras: [
            PLACEHOLDER,
            PLACEHOLDER,
            PLACEHOLDER
          ]
        },
        story: "Holy Light pierces darkness with a single unwavering line, healing and revealing true forms. Priests chant and call it down in the name of mercy. The narrative focuses on the tension between mercy and judgment — light that heals but also exposes sin."
      },

      {
        id: "E5",
        name: "Thunder Storm",
        desc: "Lightning rain.",
        tags: ["electric", "aoe"],
        rarity: "A",
        images: {
          main: PLACEHOLDER,
          extras: [
            PLACEHOLDER,
            PLACEHOLDER,
            PLACEHOLDER
          ]
        },
        story: "Thunder Storm cracks the heavens in a booming chorus; charged rain leaps from cloud to cloud and earth to sky. Farmers fear the damage; wizards harness it. The images portray fury and release — a storm both destructive and renewing."
      }
    ]
  }
};

// Notes for editing:
// - Keep each item object EXACTLY in the same shape to avoid runtime issues.
// - Required fields per item:
//   id: unique string with category prefix (e.g., "A1", "B2", "C1")
//   name: string
//   desc: short string for thumbnails
//   tags: array of strings
//   rarity: string "S"|"A"|"B"|"C"|"D"
//   images: { main: string (URL), extras: [ string, string, string ] }
//   story: long descriptive string (narrative)
// - When editing images: use full http(s) URLs or valid relative paths.
// - Keep this file loaded BEFORE script.js in your HTML:
//     <script src="data.js"></script>
//     <script src="script.js"></script>
