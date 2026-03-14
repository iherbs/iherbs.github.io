(function () {
  // Game state
  const gameState = {
    money: 100,
    time: 0,
    dayDuration: 60, // seconds per in-game day
    realTimeScale: 60, // 1 real second = 60 game seconds (1:60 ratio)
    lastPlayed: null,
    emoji: "notoemoji",
    level: 1,
    points: 0,
    quests: [],
    plotCount: 4,
    plots: [],
    inventory: {},
    pet: [],
    livestock: [],
    livestockQuests: [],
    kitchenQuests: [],
    kitchen: {
      stations: [null, null, null, null], // 4 Stoves
      unlockedRecipes: [], // Default unlocked recipes
      unlockedCount: 0, // Number of unlocked stoves
    },
    checksum: "",
    music: true,
    sfx: true,
  };
  const plantTypes = [
    { emoji: "🌾", name: "Wheat", growthTime: 6, value: 10, cost: 5 },
    { emoji: "🌽", name: "Corn", growthTime: 8, value: 15, cost: 8 },
    { emoji: "🥕", name: "Carrot", growthTime: 11, value: 15, cost: 10 },
    { emoji: "🥜", name: "Peanuts", growthTime: 11, value: 16, cost: 11 },
    { emoji: "🫘", name: "Beans", growthTime: 13, value: 16, cost: 12 },
    { emoji: "🥒", name: "Cucumber", growthTime: 13, value: 17, cost: 14 },
    { emoji: "🌶️", name: "Pepper", growthTime: 17, value: 20, cost: 15 },
    { emoji: "🫑", name: "Bell Pepper", growthTime: 18, value: 22, cost: 16 },
    { emoji: "🥔", name: "Potato", growthTime: 27, value: 30, cost: 20 },
    { emoji: "🍆", name: "Eggplant", growthTime: 25, value: 20, cost: 15 },
    { emoji: "🍅", name: "Tomato", growthTime: 30, value: 25, cost: 20 },
    { emoji: "🫛", name: "Peas", growthTime: 25, value: 20, cost: 15 },
    { emoji: "🥬", name: "Lettuce", growthTime: 28, value: 20, cost: 16 },
    { emoji: "🥦", name: "Broccoli", growthTime: 30, value: 25, cost: 18 },
    { emoji: "🌹", name: "Rose", growthTime: 30, value: 25, cost: 20 },
    { emoji: "🍎", name: "Apple", growthTime: 30, value: 25, cost: 20 },
    { emoji: "🍓", name: "Strawberry", growthTime: 26, value: 25, cost: 18 },
    { emoji: "🍐", name: "Pear", growthTime: 30, value: 25, cost: 20 },
    { emoji: "🍊", name: "Orange", growthTime: 30, value: 28, cost: 22 },
    { emoji: "🍋", name: "Lemon", growthTime: 35, value: 32, cost: 25 },
    { emoji: "🍋‍🟩", name: "Lime", growthTime: 33, value: 30, cost: 24 },
    { emoji: "🍌", name: "Banana", growthTime: 40, value: 38, cost: 30 },
    { emoji: "🍉", name: "Watermelon", growthTime: 40, value: 38, cost: 32 },
    { emoji: "🍍", name: "Pineapple", growthTime: 45, value: 45, cost: 35 },
    { emoji: "🫐", name: "Blueberries", growthTime: 44, value: 44, cost: 37 },
    { emoji: "🍈", name: "Melon", growthTime: 50, value: 48, cost: 40 },
    { emoji: "🍒", name: "Cherry", growthTime: 50, value: 45, cost: 38 },
    { emoji: "🍑", name: "Peach", growthTime: 60, value: 55, cost: 44 },
    { emoji: "🥭", name: "Mango", growthTime: 55, value: 50, cost: 42 },
    { emoji: "🍇", name: "Grapes", growthTime: 55, value: 50, cost: 45 },
    { emoji: "🥥", name: "Coconut", growthTime: 57, value: 52, cost: 46 },
    { emoji: "🥝", name: "Kiwi", growthTime: 62, value: 58, cost: 48 },
    { emoji: "🥑", name: "Avocado", growthTime: 60, value: 55, cost: 50 },
    { emoji: "🍄", name: "Mushroom", growthTime: 68, value: 62, cost: 55 },
    { emoji: "🌷", name: "Tulip", growthTime: 67, value: 61, cost: 55 },
    { emoji: "🪻", name: "Hyacinth", growthTime: 68, value: 63, cost: 58 },
    { emoji: "🪷", name: "Lotus", growthTime: 70, value: 66, cost: 60 },
    { emoji: "🌺", name: "Hibiscus", growthTime: 72, value: 68, cost: 62 },
    { emoji: "🌼", name: "Daisy", growthTime: 75, value: 70, cost: 65 },
    { emoji: "🌻", name: "Sunflower", growthTime: 80, value: 80, cost: 70 },
    { emoji: "🌸", name: "Sakura", growthTime: 110, value: 100, cost: 80 },
    { emoji: "🟫", name: "Land", growthTime: 0, value: 0, cost: 300 },
  ];
  const growthItems = [
    { emoji: "💧", name: "Water", growthBoost: 2, cost: 20 },
    { emoji: "🧴", name: "Fertilizer", growthBoost: 5, cost: 50 },
    { emoji: "🧪", name: "Potion", growthBoost: 10, cost: 100 },
  ];
  const npcs = [
    "🧔🏻‍♂️",
    "🧔🏻",
    "🤡",
    "👻",
    "🤖",
    "👽",
    "🧜🏻‍♂️",
    "🧚🏻‍♂️",
    "🧞‍♂️",
    "🧝🏻‍♂️",
    "🧙🏻‍♂️",
    "🧛🏻‍♂️",
    "🧟‍♂️",
    "🥷🏻",
    "🎅🏻",
    "💂🏻‍♂️",
    "🤴🏻",
    "👷🏻‍♂️",
    "👮🏻‍♂️",
    "🕵🏻‍♂️",
    "👨🏻‍✈️",
    "👨🏻‍🔬",
    "👨🏻‍⚕️",
    "👨🏻‍🔧",
    "👨🏻‍🏭",
    "👨🏻‍🚒",
    "👨🏻‍🌾",
    "👨🏻‍💼",
    "👨🏻‍⚖️",
    "👨🏻‍🎤",
    "👨🏻‍🎨",
    "👨🏻‍🍳",
    "🧕🏻",
    "👳🏻‍♂️",
    "👲🏻",
    "👨🏻‍🦳",
    "👨🏻‍🦱",
    "👨🏻‍🦲",
    "🕴🏻",
    "💃🏻",
    "🕺🏻",
  ];
  const petTypes = [
    { id: "dog", name: "Dog", emoji: "🐕", cost: 500 },
    { id: "cat", name: "Cat", emoji: "🐈", cost: 500 },
    { id: "rabbit", name: "Rabbit", emoji: "🐇", cost: 700 },
    { id: "butterfly", name: "Butterfly", emoji: "🦋", cost: 1100 },
    { id: "swan", name: "Swan", emoji: "🦢", cost: 1300 },
    { id: "snail", name: "Snail", emoji: "🐌", cost: 1500 },
    { id: "poodle", name: "Poodle", emoji: "🐩", cost: 1800 },
    { id: "blackcat", name: "Black Cat", emoji: "🐈‍⬛", cost: 2100 },
    { id: "jellyfish", name: "Jellyfish", emoji: "🪼", cost: 2500 },
    { id: "crab", name: "Crab", emoji: "🦀", cost: 2900 },
    { id: "pufferfish", name: "Pufferfish", emoji: "🐡", cost: 3300 },
    { id: "fish", name: "Fish", emoji: "🐟", cost: 3500 },
    { id: "tropicfish", name: "Tropicfish", emoji: "🐠", cost: 3700 },
    { id: "dodo", name: "Dodo", emoji: "🦤", cost: 4100 },
    { id: "hedgehog", name: "Hedgehog", emoji: "🦔", cost: 4500 },
    { id: "dinosaur", name: "Dinosaur", emoji: "🦖", cost: 5000 },
  ];
  const petFoods = [
    {
      id: "lollipop",
      name: "Lollipop",
      emoji: "🍭",
      cost: 50,
      hungerValue: 20,
    },
    {
      id: "chocolate",
      name: "Chocolate",
      emoji: "🍫",
      cost: 100,
      hungerValue: 40,
    },
  ];
  const petFeedItems = [
    { emoji: "🌾", hungerValue: 2 },
    { emoji: "🌽", hungerValue: 3 },
    { emoji: "🥕", hungerValue: 4 },
  ];
  const livestockItems = [
    { emoji: "🥚", name: "Egg", value: 10 },
    { emoji: "🍗", name: "Chicken", value: 110 },
    { emoji: "🥛", name: "Milk", value: 20 },
    { emoji: "🥩", name: "Beef", value: 180 },
  ];

  const livestockTypes = [
    {
      type: "chicken",
      emoji: "🐓",
      name: "Chicken",
      cost: 300,
      max: 7,
      food: "🌽",
      yield: "🥚",
      meat: "🍗",
      growthTime: 50,
      minYieldsToSlaughter: 3,
    },
    {
      type: "cow",
      emoji: "🐄",
      name: "Cow",
      cost: 800,
      max: 5,
      food: "🌾",
      yield: "🥛",
      meat: "🥩",
      growthTime: 100,
      minYieldsToSlaughter: 5,
    },
  ];

  const recipes = [
    {
      id: "popcorn",
      emoji: "🍿",
      name: "Popcorn",
      ingredients: { "🌽": 1 },
      time: 10,
      value: 8,
      cost: 100,
    },
    {
      id: "french_fries",
      emoji: "🍟",
      name: "French Fries",
      ingredients: { "🥔": 1 },
      time: 12,
      value: 23,
      cost: 300,
    },
    {
      id: "juice",
      emoji: "🍹",
      name: "Juice",
      ingredients: { "🍍": 1 },
      time: 14,
      value: 38,
      cost: 500,
    },
    {
      id: "wine",
      emoji: "🍷",
      name: "Wine",
      ingredients: { "🍇": 1 },
      time: 16,
      value: 48,
      cost: 500,
    },
    {
      id: "salad",
      emoji: "🥗",
      name: "Salad",
      ingredients: { "🥬": 1, "🍅": 1, "🥒": 1 },
      time: 17,
      value: 59,
      cost: 700,
    },
    {
      id: "omelet",
      emoji: "🍳",
      name: "Omelet",
      ingredients: { "🥚": 1 },
      time: 20,
      value: 12,
      cost: 700,
    },
    {
      id: "cheese",
      emoji: "🧀",
      name: "Cheese",
      ingredients: { "🥛": 1 },
      time: 25,
      value: 45,
      cost: 600,
    },
    {
      id: "bread",
      emoji: "🍞",
      name: "Bread",
      ingredients: { "🌾": 1, "🥛": 1 },
      time: 28,
      value: 25,
      cost: 800,
    },
    {
      id: "spaghetti",
      emoji: "🍝",
      name: "Spaghetti",
      ingredients: { "🌾": 1, "🍅": 1, "🥚": 1 },
      time: 30,
      value: 33,
      cost: 900,
    },
    {
      id: "ice_cream",
      emoji: "🍦",
      name: "Ice Cream",
      ingredients: { "🥛": 1, "🍓": 1 },
      time: 33,
      value: 45,
      cost: 500,
    },
    {
      id: "pancake",
      emoji: "🥞",
      name: "Pancake",
      ingredients: { "🌾": 1, "🥚": 1, "🥛": 1 },
      time: 35,
      value: 55,
      cost: 700,
    },
    {
      id: "cake",
      emoji: "🍰",
      name: "Cake",
      ingredients: { "🌾": 1, "🥚": 1, "🍓": 1 },
      time: 38,
      value: 55,
      cost: 1000,
    },
    {
      id: "sandwich",
      emoji: "🥪",
      name: "Sandwich",
      ingredients: { "🍞": 1, "🥬": 1, "🥒": 1, "🍅": 1, "🥚": 1 },
      time: 48,
      value: 110,
      cost: 1100,
    },
    {
      id: "soup",
      emoji: "🍲",
      name: "Soup",
      ingredients: { "🥬": 1, "🍗": 1, "🥒": 1, "🍅": 1, "🥚": 1 },
      time: 42,
      value: 200,
      cost: 1200,
    },
    {
      id: "taco",
      emoji: "🌮",
      name: "Taco",
      ingredients: { "🌽": 1, "🥩": 1, "🥬": 1 },
      time: 50,
      value: 220,
      cost: 1200,
    },
    {
      id: "hot_dog",
      emoji: "🌭",
      name: "Hot Dog",
      ingredients: { "🍞": 1, "🥬": 1, "🥩": 1 },
      time: 55,
      value: 240,
      cost: 1400,
    },
    {
      id: "burger",
      emoji: "🍔",
      name: "Burger",
      ingredients: { "🍞": 1, "🥬": 1, "🥒": 1, "🍅": 1, "🥩": 1, "🧀": 1 },
      time: 58,
      value: 300,
      cost: 1700,
    },
    {
      id: "pizza",
      emoji: "🍕",
      name: "Pizza",
      ingredients: { "🍞": 1, "🍅": 1, "🥩": 1, "🫑": 1, "🍄": 1, "🧀": 1 },
      time: 66,
      value: 330,
      cost: 2000,
    },
  ];

  const maxmoney = 999999;
  let selectedSeed = null;
  let gameInterval = null;
  let autoHarvestInterval = 1;

  const _ = (id) => {
    let el = {};
    if (id.substr(0, 1) == "#") {
      el = document.getElementById(id.substr(1, id.length));
    } else if (id.substr(0, 1) == ".") {
      el = document.querySelectorAll(id);
    } else if (id.substr(0, 1) == "@") {
      el = document.getElementsByName(id.substr(1, id.length));
    }
    if (!el) {
      // console.warn(`Element ${id} not found`);
    }
    return el;
  };

  // DOM elements
  const farmGrid = _("#farm-grid");
  const marketItems = _("#market-items");
  const moneyDisplay = _("#money");
  const inventoryDisplay = _("#inventory");
  const notification = _("#notification");
  const timeProgressBar = _("#time-progress");
  const lastPlayedDisplay = _("#last-played");
  const levelDisplay = _("#level");
  const pointsProgress = _("#points-progress");
  const pointsText = _("#points-text");
  const questContent = _("#quest-content");
  const livestockQuestContent = _("#livestock-quests");
  const setting = _("#setting");
  const marketbtn = _("#market-button");

  const popupOverlay = _("#popup-overlay");
  const popupTitle = _("#popup-title");
  const popupMessage = _("#popup-message");
  const popupConfirm = _("#popup-confirm");
  const popupCancel = _("#popup-cancel");

  const maxplant = plantTypes.length - 2;
  // Initialize the game
  const initGame = () => {
    if (!localStorage.getItem("emojiFarm")) {
      setTimeout(() => showTutorial(), 100); // Delay to ensure UI loads
    }
    loadGame();
    createFarmPlots();
    setupMarketTabs();
    populateMarket();
    populateGrowthItems();
    updatePetUI();
    updateUI();
    startGameLoop();
    updateLastPlayedDisplay();
    generateQuests();
    generateLivestockQuests();
    generateKitchenQuests();
    initLivestock();
    initKitchen();
  };

  // Show tutorial popup
  const showTutorial = () => {
    // Tutorial content
    const tutorialContent = `
        <div style="text-align: left; font-size: 0.9rem; max-height: 400px; overflow-y: auto;line-height: 1.6;">
            <h2>Cozy Emoji Farm 🌱</h2>
            <p>Welcome to <em>Cozy Emoji Farm</em>, a relaxing farming adventure where you grow crops, complete quests, care for pets, and enjoy a fun matching crops! Here’s how to get started:</p>
            <br>
            <h3>1. Manage Your Farm</h3>
            <ul>
                <li><strong>Plant Crops</strong>: Visit the <em>Market</em> (🌱 Seed tab) to buy seeds. Click a seed to select it, then tap an empty plot in the <em>Farm Grid</em> to plant. Each seed costs 🪙.</li>
                <li><strong>Grow and Harvest</strong>: Crops grow over time, shown by a progress bar. When the bar is full, click the plot to harvest the crop. Harvested crops go to your <em>Inventory</em>.</li>
                <li><strong>Boost Growth</strong>: Use items from the <em>Growth</em> tab (💧 Water, 🧴 Fertilizer, 🧪 Potion) to speed up crop growth. Select an item and click a growing plot to apply it.</li>
            </ul>
            <br>
            <h3>2. Complete Quests</h3>
            <ul>
                <li>Check the <em>Quest</em> panel (📃) to see tasks from friendly NPCs. Each quest asks for a specific number of crops (e.g., 3 🌾 Wheat).</li>
                <li>Deliver crops from your <em>Inventory</em> by clicking the checkmark button when you have enough. Completing quests earns (🪙), points, and helps you level up!</li>
            </ul>
            <br>
            <h3>3. Care for Your Pet</h3>
            <ul>
                <li>Adopt a pet in the <em>Pet</em> panel (🐾) by clicking <em>Buy</em> and choosing a pet (e.g., 🐈 Cat). Pets cost 🪙.</li>
                <li>Feed your pet with food (🍭 Lollipop, 🍫 Chocolate) or crops from your <em>Inventory</em> using the <em>Feed</em> button. Keep their hunger bar full!</li>
                <li>A well-fed pet (hunger ≥ 20) will automatically harvest ripe crops for you.</li>
            </ul>
            <br>
            <h3>4. Play the Plant Match</h3>
            <ul>
                <li>Access the Plant Match by clicking the <em>Match</em> button (🌿) in the <em>Quest</em> panel. It costs 🪙 to play.</li>
                <li><strong>How to Play</strong>:
                    <ul>
                        <li>You’ll see a 6x6 grid filled with crop emojis (e.g., 🌾, 🌽).</li>
                        <li>Swap adjacent crops by clicking one, then clicking a neighboring crop to form rows or columns of 3 or more identical crops.</li>
                        <li>Matching 3 crops earns 10 points, 4 crops earns 20 points, and 5+ crops earns 30 points. Matching 4 or more also adds that crop to your <em>Inventory</em> (e.g., match 4 🌾 to get 1 Wheat).</li>
                        <li>You will have moves to reach 500 points. If you succeed, you’ll earn 🪙.</li>
                    </ul>
                </li>
                <li><strong>Tips</strong>:
                    <ul>
                        <li>Plan swaps to create bigger matches for more points and crops.</li>
                        <li>Listen for sound effects and watch animations to know when matches are made!</li>
                    </ul>
                </li>
            </ul>
            <br>
            <h3>5. Level Up and Expand</h3>
            <ul>
                <li>Earn points by completing quests to level up. Higher levels unlock new crops in the <em>Market</em>.</li>
                <li>Buy additional plots (🟫 Land) in the <em>Market</em> to expand your farm.</li>
                <li>Sell crops in your <em>Inventory</em> by clicking them and choosing a quantity to earn extra 🪙.</li>
            </ul>
            <br>
            <h3>6. Save Your Progress</h3>
            <ul>
                <li>Your progress is automatically saved. Return anytime to continue farming!</li>
            </ul>
            <br>
            <h3>Tips for Success</h3>
            <ul>
                <li>Keep planting and harvesting to build your <em>Inventory</em> for quests.</li>
                <li>Feed your pet regularly to ensure automatic harvesting.</li>
                <li>Play <em>Plant Match</em> to earn extra 🪙 and crops, especially if you need specific crops for quests.</li>
                <li>Manage your 🪙 wisely—don’t spend all at once, as you’ll need some for seeds</li>
            </ul>

            <p>Ready to start your farming journey? Plant your first crop, adopt a pet, and dive into <em>Plant Match</em> for extra fun! Happy farming! 🌾🐾</p>
        </div>
        `;
    showPopup(tutorialContent, "How to Play", false);
  };

  const music = _("#background-audio");
  music.volume = 0.9;
  document.addEventListener("click", () => {
    if (gameState.music) {
      music.play().catch((e) => {
        console.log("Autoplay blocked, but user clicked!");
      });
    }
  });

  // Play sound effect
  const sfx = _("#sfx");
  const playSound = (soundFile) => {
    if (gameState.sfx) {
      const audio = new Audio(`music/${soundFile}`);
      audio.play();
    }
  };

  const toggleMarket = () => {
    if (_("#market").style.transform == "translate(-50%, 0px)") {
      _("#market").style.transform = "translate(-50%, 170px)";
    } else {
      _("#market").style.transform = "translate(-50%, 0px)";
    }
  };

  _("#market-button").addEventListener("click", () => {
    toggleMarket();
  });

  _("#market-close").addEventListener("click", () => {
    toggleMarket();
  });

  _("#livestock-button").addEventListener("click", () => {
    openLivestockPage();
  });

  const setupMarketTabs = () => {
    document.querySelectorAll(".market-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        // Hapus class active dari semua tab
        document
          .querySelectorAll(".market-tab")
          .forEach((t) => t.classList.remove("active"));
        // Tambahkan class active ke tab yang diklik
        tab.classList.add("active");
        // Tampilkan konten yang sesuai
        const tabType = tab.dataset.tab;
        _("#market-items").style.display = tabType === "seed" ? "flex" : "none";
        _("#growth-items").style.display =
          tabType === "growth" ? "flex" : "none";
      });
    });
  };

  const populateGrowthItems = () => {
    const growthItemsContainer = _("#growth-items");
    growthItemsContainer.innerHTML = "";

    growthItems.forEach((item) => {
      const marketItem = document.createElement("div");
      marketItem.className = "market-item";
      marketItem.dataset.emoji = item.emoji;
      marketItem.innerHTML = `
                <div class="market-item-emoji">${item.emoji}</div>
                <div class="market-item-name">${item.name}</div>
                <div class="market-item-cost">🪙${item.cost}</div>
            `;
      marketItem.addEventListener("click", () => {
        // Hapus class selected dari semua item
        document
          .querySelectorAll(".market-item")
          .forEach((i) => i.classList.remove("selected"));
        // Tambahkan class selected ke item yang diklik
        marketItem.classList.add("selected");
        selectedSeed = item.emoji;
        marketbtn.innerHTML = item.emoji;
        toggleMarket();
      });
      growthItemsContainer.appendChild(marketItem);
    });
  };

  // Dapatkan tanaman yang tersedia di market berdasarkan level
  const getAvailablePlants = (level) => {
    level = level > maxplant ? maxplant : level;
    // Pada Level 1, hanya Wheat dan Corn
    const basePlants = plantTypes.slice(0, 2); // 🌾, 🌽
    // Tambah 1 tanaman per level setelah Level 1
    const additionalPlants =
      level > 1 ? plantTypes.slice(2, 2 + (level - 1)) : [];
    // Selalu sertakan Land
    const landPlant =
      gameState.plotCount < 16 ? plantTypes.find((p) => p.emoji === "🟫") : [];
    if (landPlant.length == 0) {
      if (additionalPlants.length == 0) {
        return [...basePlants];
      } else {
        return [...basePlants, ...additionalPlants];
      }
    } else if (additionalPlants.length == 0) {
      if (landPlant.length == 0) {
        return [...basePlants];
      } else {
        return [...basePlants, landPlant];
      }
    } else {
      return [...basePlants, ...additionalPlants, landPlant];
    }
  };

  // Populate market items
  const populateMarket = () => {
    marketItems.innerHTML = "";

    const availablePlants = getAvailablePlants(gameState.level);

    availablePlants.forEach((plant) => {
      const item = document.createElement("div");
      item.className = "market-item";
      item.dataset.emoji = plant.emoji;

      item.innerHTML = `
                <div class="market-item-emoji">${plant.emoji}</div>
                <div class="market-item-name">${plant.name}</div>
                <div class="market-item-cost">🪙${getPlantCost(plant.emoji)}</div>
            `;
      item.addEventListener("click", async () => {
        // Remove selected class from all items
        document
          .querySelectorAll(".market-item")
          .forEach((i) => i.classList.remove("selected"));
        if (plant.emoji == "🟫") {
          let confirmed = await showPopup(
            '<span style="font-size:20px;">Buy Land 🟫?</span>',
          );
          if (confirmed) {
            const seedCost = getPlantCost(plant.emoji);
            if (gameState.money >= seedCost) {
              if (gameState.money - seedCost >= 50) {
                gameState.money -= seedCost;
                gameState.plotCount++;
                updateUI();
                createFarmPlots();
                populateMarket();
                toggleMarket();
                showNotification(`New Land 🟫 Added!`);
              } else {
                showNotification(`can't buy, not good for your 🪙 health`);
              }
            } else {
              showNotification(`Not enough 🪙<br>to buy Land!`);
            }
          }
        } else {
          // Add selected class to clicked item
          item.classList.add("selected");
          selectedSeed = plant.emoji;
          marketbtn.innerHTML = plant.emoji;
          toggleMarket();
          // showNotification(`Selected ${plant.name} for planting!`);
        }
      });
      marketItems.appendChild(item);
    });
  };

  // Calculate growth while game was closed
  const calculateOfflineProgress = () => {
    if (!gameState.lastPlayed) return;
    const now = new Date();
    const lastPlayed = new Date(gameState.lastPlayed);
    const secondsPassed = (now - lastPlayed) / 1000;
    const gameSecondsPassed = secondsPassed * gameState.realTimeScale;
    if (gameSecondsPassed > 0) {
      const maxDays = 120; // Batas maksimum 120 hari offline
      const daysPassed = Math.min(
        Math.floor(gameSecondsPassed / gameState.dayDuration),
        maxDays,
      );
      const remainingSeconds = gameSecondsPassed % gameState.dayDuration;
      if (daysPassed > 0) {
        for (let i = 0; i < daysPassed; i++) {
          advanceDay();
        }
        setTimeout(() => {
          showNotification(`Welcome back!`);
        }, 300);
      }
      gameState.time = remainingSeconds;

      // Update livestock production
      gameState.livestock.forEach((ls) => {
        if (ls.isProducing && !ls.yieldReady) {
          const lsInfo = livestockTypes.find((l) => l.type === ls.type);
          if (lsInfo) {
            // production increases by real seconds * 0.1 (since tick is 100ms)
            // Wait, calculateOfflineProgress uses gameSecondsPassed.
            // Tick increases production by 0.1 every 100ms.
            // That means production increases by 1.0 every 1 second of real time.
            ls.production += secondsPassed;

            if (ls.production >= lsInfo.growthTime) {
              ls.production = lsInfo.growthTime;
              ls.yieldReady = true;
            }
          }
        }
      });
    }
  };

  // Create farm plots
  const createFarmPlots = () => {
    farmGrid.innerHTML = "";

    // Initialize plots array if needed
    while (gameState.plots.length < gameState.plotCount) {
      gameState.plots.push({ plant: null, growth: 0, plantedAt: null });
    }

    // Trim if we have more plots than needed
    gameState.plots = gameState.plots.slice(0, gameState.plotCount);

    for (let i = 0; i < gameState.plotCount; i++) {
      const plot = document.createElement("div");
      plot.className = "plot";
      plot.dataset.index = i;

      const plant = document.createElement("div");
      plant.className = "plant grow-animation";
      plant.textContent = gameState.plots[i].plant || "";

      const progressContainer = document.createElement("div");
      progressContainer.className = "progress-container";

      const progressIcon = document.createElement("div");
      progressIcon.textContent = gameState.plots[i].plant || "";
      progressIcon.className = "progress-icon";

      const progressWrap = document.createElement("div");
      progressWrap.className = "progress-wrap";

      const progressBar = document.createElement("div");
      progressBar.className = "progress-bar";

      // Calculate growth progress
      if (gameState.plots[i].plant) {
        const growthTime = getGrowthTime(gameState.plots[i].plant);
        const growthProgress = Math.min(gameState.plots[i].growth, growthTime);
        progressBar.style.width = `${(growthProgress / growthTime) * 100}%`;
      } else {
        progressBar.style.width = "0%";
      }

      progressContainer.appendChild(progressIcon);
      progressContainer.appendChild(progressWrap);
      progressWrap.appendChild(progressBar);
      plot.appendChild(plant);
      plot.appendChild(progressContainer);

      plot.addEventListener("click", () => handlePlotClick(i));
      farmGrid.appendChild(plot);
    }

    for (let j = gameState.plotCount; j < 16; j++) {
      const plot = document.createElement("div");
      plot.className = "plot";
      plot.innerHTML = '<div class="plant"></div>';
      farmGrid.appendChild(plot);
    }
  };

  // Handle plot click
  const handlePlotClick = async (index) => {
    const plot = gameState.plots[index];

    // console.log(selectedSeed);
    playSound("tap.wav");
    if (!plot.plant) {
      // Plant a seed if empty and seed is selected
      if (selectedSeed && marketbtn.innerHTML != "🌱") {
        const item = plantTypes.find((i) => i.emoji === selectedSeed);
        if (item != undefined) {
          const seedCost = getPlantCost(selectedSeed);

          if (gameState.money >= seedCost) {
            plot.plant = selectedSeed;
            plot.growth = 0;
            plot.plantedAt = new Date().toISOString();
            gameState.money -= seedCost;
            updatePlotUI(index);
            updateUI();
            // showNotification(`Planted ${getPlantName(selectedSeed)} for 🪙${seedCost}!`);
            // selectedSeed = null;
            // Reset selected item in market
            // document.querySelectorAll('.market-item').forEach(i => i.classList.remove('selected'));
            saveGame();
          } else {
            showNotification(`Not enough 🪙<br>to buy ${selectedSeed}!`);
            // Reset selected item in market
            // document.querySelectorAll('.market-item').forEach(i => i.classList.remove('selected'));
          }
        } else {
          // selectedSeed = null;
          // document.querySelectorAll('.market-item').forEach(i => i.classList.remove('selected'));
        }
      } else {
        toggleMarket();
      }
    } else if (plot.plant && isReadyToHarvest(index)) {
      // Harvest if ready
      harvestPlant(index);
    } else if (plot.plant && selectedSeed) {
      // Gunakan item percepatan jika tanaman ada dan item dipilih
      const item = growthItems.find((i) => i.emoji === selectedSeed);
      if (item != undefined) {
        if (gameState.money >= item.cost) {
          if (gameState.money - item.cost >= 50) {
            playSound("growth.wav");
            gameState.money -= item.cost;
            plot.growth += item.growthBoost;
            if (plot.growth > getGrowthTime(plot.plant)) {
              plot.growth = getGrowthTime(plot.plant); // Batasi pertumbuhan maksimum
            }
            updatePlotUI(index);
            updateUI();
            // showNotification(`Used ${item.name} ${item.emoji} to boost growth!`);

            if (farmGrid.children[index] != null) {
              const plotElement = farmGrid.children[index];
              const progressWrap = plotElement.querySelector(".progress-wrap");
              progressWrap.classList.add("power-growth-animation");
              setTimeout(() => {
                progressWrap.classList.remove("power-growth-animation");
              }, 500);
            }
            // document.querySelectorAll('.market-item').forEach(i => i.classList.remove('selected'));
            saveGame();
          } else {
            showNotification(`can't buy, not good for your 🪙 health`);
          }
        } else {
          showNotification(`Not enough 🪙<br>to use ${item.emoji}!`);
        }
      }
      // selectedSeed = null;
      // document.querySelectorAll('.market-item').forEach(i => i.classList.remove('selected'));
    }
  };

  // Check if plant is ready to harvest
  const isReadyToHarvest = (index) => {
    const plot = gameState.plots[index];
    return plot.growth >= getGrowthTime(plot.plant);
  };

  // Harvest a plant
  const harvestPlant = (index, ispet = false) => {
    const plot = gameState.plots[index];
    const plantEmoji = plot.plant;
    const plantValue = getPlantValue(plantEmoji);
    if (plantEmoji != "🐾") {
      // Add to inventory
      if (!gameState.inventory[plantEmoji]) {
        gameState.inventory[plantEmoji] = 0;
      }
      gameState.inventory[plantEmoji]++;
      // Add money
      // gameState.money += plantValue;
    }

    // Clear the plot
    if (ispet) {
      if (gameState.pet.length > 0 && gameState.pet[0].hunger >= 20) {
        plot.plant = "🐾";
      }

      setTimeout(() => {
        plot.plant = null;
        plot.growth = 0;
        plot.plantedAt = null;

        // Update UI
        updatePlotUI(index);
        updateUI();

        // Show notification
        // showNotification(`Harvested ${getPlantName(plantEmoji)} for 🪙${plantValue}!`);
        saveGame();
      }, 300);
    } else {
      plot.plant = null;
      plot.growth = 0;
      plot.plantedAt = null;

      // Update UI
      updatePlotUI(index);
      updateUI();

      // Show notification
      // showNotification(`Harvested ${getPlantName(plantEmoji)} for 🪙${plantValue}!`);
      saveGame();
    }
  };

  // Start the game loop for automatic day progression
  const startGameLoop = () => {
    if (gameInterval) {
      clearInterval(gameInterval);
    }
    let lastAutoHarvest = 0;
    gameInterval = setInterval(() => {
      gameState.time += 0.1;

      // Kurangi hunger setiap hari (10 per hari, 60 detik)
      if (gameState.pet.length > 0) {
        petHungerHandler(
          gameState.pet[0].hunger - 3 / (gameState.dayDuration / 0.1),
          true,
        );
        updatePetUI();
        if (gameState.pet[0].hunger < 20 && gameState.pet[0].hunger >= 19.9) {
          showNotification(`Your pet is hungry!<br>Feed your pet.`);
        }
      }

      // Panen otomatis setiap 2 detik
      lastAutoHarvest += 0.1;
      if (lastAutoHarvest >= autoHarvestInterval) {
        autoHarvest();
        lastAutoHarvest = 0;
      }

      // Update livestock
      if (gameState.livestock && gameState.livestock.length > 0) {
        const isLivestockVisible =
          _("#livestock-container").style.display === "flex";

        gameState.livestock.forEach((ls) => {
          if (!ls.isDragging) {
            // Roaming (update every ~2 seconds for new target)
            if (Math.random() < 0.02) {
              ls.newX = Math.max(
                0,
                Math.min(80, ls.x + (Math.random() * 40 - 20)),
              );
              ls.newY = Math.max(
                0,
                Math.min(80, ls.y + (Math.random() * 40 - 20)),
              );
              ls.dir = ls.newX > ls.x ? -1 : 1; // Flip based on direction
            }

            // Move towards target
            if (ls.newX !== undefined) {
              // Position lerping is now handled by requestAnimationFrame for 60FPS smoothness
            }
          }

          if (ls.isProducing && !ls.yieldReady) {
            ls.production += 0.1;
            const lsInfo = livestockTypes.find((l) => l.type === ls.type);
            if (ls.production >= lsInfo.growthTime) {
              ls.production = lsInfo.growthTime;
              ls.yieldReady = true;
              showNotification(`${ls.emoji} has produced ${lsInfo.yield}`);
            }
          }
        });

        if (isLivestockVisible) {
          updateLivestockUI();
        }
      }

      // Update kitchen
      const isActiveCooking = gameState.kitchen.stations.some(
        (s) => s !== null,
      );
      if (isActiveCooking) {
        if (_("#kitchen-container").style.display === "flex") {
          updateKitchenStations();
        }
      }

      updateTimeDisplay();
      const hasGrowingPlants = gameState.plots.some((plot) => plot.plant);
      if (hasGrowingPlants) {
        updatePlantGrowth(0.1);
      }
      if (gameState.time >= gameState.dayDuration) {
        nextDay();
      }
    }, 100);

    // --- High-Frequency Animation Loop (60FPS) for Smooth Livestock Movement ---
    const syncLivestockMovement = () => {
      const container = _("#livestock-container");
      if (container && container.style.display === "flex") {
        gameState.livestock.forEach((ls) => {
          if (!ls.isDragging && ls.newX !== undefined) {
            // Smoothly interpolate towards target (Lerp)
            // 0.02 factor at 60FPS is roughly equivalent to 0.12 per 100ms
            ls.x += (ls.newX - ls.x) * 0.005;
            ls.y += (ls.newY - ls.y) * 0.005;

            // Only update DOM if it exists to avoid unnecessary lookups
            const item = document.getElementById(`ls-item-${ls.id}`);
            if (item) {
              item.style.left = `calc(${ls.x}% - 40px)`;
              item.style.top = `calc(${ls.y}% - 40px)`;
            }
          }
        });
      }
      requestAnimationFrame(syncLivestockMovement);
    };
    requestAnimationFrame(syncLivestockMovement);
  };

  // Update plant growth based on elapsed time
  const updatePlantGrowth = (seconds) => {
    gameState.plots.forEach((plot, index) => {
      if (plot.plant) {
        plot.growth += seconds;
        if (plot.growth > getGrowthTime(plot.plant)) {
          plot.growth = getGrowthTime(plot.plant); // Cap at max growth
        }
        updatePlotUI(index);
      }
    });
  };

  // Update time display
  const updateTimeDisplay = () => {
    const progressPercent = (gameState.time / gameState.dayDuration) * 100;
    timeProgressBar.style.width = `${progressPercent}%`;
  };

  // Advance to next day
  const advanceDay = () => {
    // Grow plants by a full day
    gameState.plots.forEach((plot, index) => {
      if (plot.plant) {
        plot.growth++;
        if (plot.growth > getGrowthTime(plot.plant)) {
          plot.growth = getGrowthTime(plot.plant); // Cap at max growth
        }
        updatePlotUI(index);
      }
    });
  };

  // Complete day transition
  const nextDay = () => {
    advanceDay();
    gameState.time = 0;
    updateTimeDisplay();
    updateUI();
    // showNotification(`Day ${gameState.day} begins!`);
    saveGame();
  };

  // Update a single plot's UI
  const updatePlotUI = (index) => {
    if (farmGrid.children[index] != null) {
      const plotElement = farmGrid.children[index];
      const plot = gameState.plots[index];
      const plantElement = plotElement.querySelector(".plant");
      const progressBar = plotElement.querySelector(".progress-bar");
      const progressIcon = plotElement.querySelector(".progress-icon");

      if (plot.plant) {
        // Show seedling if not fully grown
        if (plot.growth < getGrowthTime(plot.plant)) {
          if (plantElement.textContent !== "🌱")
            plantElement.textContent = "🌱";
          if (!plantElement.classList.contains("grow-animation")) {
            plantElement.classList.remove("wave-animation");
            plantElement.classList.add("grow-animation");
          }
          if (progressIcon.textContent !== plot.plant)
            progressIcon.textContent = plot.plant;
        } else {
          if (plantElement.textContent !== plot.plant)
            plantElement.textContent = plot.plant;
          if (!plantElement.classList.contains("wave-animation")) {
            plantElement.classList.add("wave-animation");
            plantElement.classList.remove("grow-animation");
          }
          if (progressIcon.textContent !== "") progressIcon.textContent = "";
        }

        const widthStr = `${(plot.growth / getGrowthTime(plot.plant)) * 100}%`;
        if (progressBar.style.width !== widthStr)
          progressBar.style.width = widthStr;
      } else {
        if (progressIcon.textContent !== "") progressIcon.textContent = "";
        if (plantElement.textContent !== "") plantElement.textContent = "";
        if (progressBar.style.width !== "0%") progressBar.style.width = "0%";
      }
    }
  };

  // Update all UI elements
  const updateUI = () => {
    moneyDisplay.textContent = gameState.money;
    levelDisplay.textContent = gameState.level;
    const pointsNeeded = getPointsNeededForNextLevel(gameState.level);
    pointsProgress.style.width = `${(gameState.points / pointsNeeded) * 100}%`;
    pointsText.textContent = `${gameState.points}/${pointsNeeded}`;

    // Update inventory display
    inventoryDisplay.innerHTML = "";
    Object.entries(gameState.inventory).forEach(([emoji, count]) => {
      if (count > 0) {
        const item = document.createElement("div");
        item.className = "inventory-item";
        item.style.cursor = "pointer"; // Visual feedback bahwa item bisa diklik
        item.innerHTML = `
                    <span>${emoji}</span>
                    <span class="inventory-count">${count}</span>
                `;
        // Tambahkan event listener untuk penjualan
        item.addEventListener("click", () => {
          const plantName = getPlantName(emoji);
          const sellPrice = getSellPrice(emoji);
          if (sellPrice === 0) return; // Prevent selling items with no value

          showPopup(`
                        Sell ${plantName} (${emoji}) for 🪙${sellPrice} each?<br>
                        <button type="button" id="qtysellmin" style="position:relative;top:2px;padding:5px;background:#ffffff;color:#000000;">➖</button>
                        <input type="number" id="sell-quantity" min="1" max="${count}" value="${count}" style="width:100px;margin:10px;padding:5px 8px;border-radius: 5px;border:2px solid #2E8B57;text-align:right;outline:none;">
                        <button type="button" id="qtyselladd" style="position:relative;top:2px;padding:5px;background:#ffffff;color:#000000;">➕</button>
                        <div>Total: 🪙<span id="sell-total">${count * sellPrice}</span></div>
                    `).then((confirmed) => {
            if (confirmed) {
              const quantityInput = _("#sell-quantity");
              const quantity = parseInt(quantityInput.value);
              if (quantity > 0 && quantity <= count) {
                const sell = quantity * sellPrice || 0;
                gameState.money += sell;
                gameState.money =
                  gameState.money > maxmoney ? maxmoney : gameState.money;
                gameState.inventory[emoji] -= quantity;
                if (gameState.inventory[emoji] <= 0) {
                  delete gameState.inventory[emoji];
                }
                updateUI();
                saveGame();
                showNotification(
                  `Sold ${quantity} ${plantName} for 🪙${sell}!`,
                );
              }
            }
          });

          _("#sell-quantity").addEventListener("input", (e) => {
            let quantity = parseInt(e.target.value);
            if (quantity < 1) {
              quantity = 1;
            }
            if (quantity > count) {
              quantity = count;
            }
            if (isNaN(quantity)) {
              quantity = 0;
            } else {
              e.target.value = quantity;
            }
            _("#sell-total").textContent = quantity * sellPrice;
          });

          _("#qtysellmin").addEventListener("click", () => {
            let qty = parseInt(_("#sell-quantity").value) - 1;
            if (qty < 1) {
              qty = 1;
              _("#sell-quantity").value = 1;
            } else {
              _("#sell-quantity").value = qty;
            }
            _("#sell-total").textContent = qty * sellPrice;
          });

          _("#qtyselladd").addEventListener("click", () => {
            let qty = parseInt(_("#sell-quantity").value) + 1;
            if (qty > count) {
              qty = count;
              _("#sell-quantity").value = count;
            } else {
              _("#sell-quantity").value = qty;
            }
            _("#sell-total").textContent = qty * sellPrice;
          });
        });
        inventoryDisplay.appendChild(item);
      }
    });

    // Perbarui quest UI untuk memeriksa ketersediaan inventory
    updateQuestUI();
    updateLivestockQuestUI();
    updateKitchenQuestsUI();
  };

  // Update last played display
  const updateLastPlayedDisplay = () => {
    if (gameState.lastPlayed) {
      const lastPlayed = new Date(gameState.lastPlayed);
      lastPlayedDisplay.textContent = `Last played: ${lastPlayed.toLocaleString()}`;
    }
  };

  // Show notification
  let notificationTimeout;
  const showNotification = (message) => {
    clearTimeout(notificationTimeout);
    notification.classList.remove("show-notification");
    notification.innerHTML = message;
    notification.classList.add("show-notification");
    notificationTimeout = setTimeout(() => {
      notification.classList.remove("show-notification");
    }, 3000);
  };

  // Helper functions to get plant info
  const getGrowthTime = (emoji) => {
    const plant = plantTypes.find((p) => p.emoji === emoji);
    return plant ? plant.growthTime : 0;
  };

  const getPlantValue = (emoji) => {
    const plant = plantTypes.find((p) => p.emoji === emoji);
    return plant ? plant.value : 0;
  };

  const getPlantCost = (emoji) => {
    const plant = plantTypes.find((p) => p.emoji === emoji);
    const landprice = (gameState.plotCount - 3) * 300;
    return plant ? (plant.emoji == "🟫" ? landprice : plant.cost) : 0;
  };

  const getPlantName = (emoji) => {
    const plant = plantTypes.find((p) => p.emoji === emoji);
    if (plant) return plant.name;
    const livestockItem = livestockItems.find((l) => l.emoji === emoji);
    if (livestockItem) return livestockItem.name;
    const recipe = recipes.find((r) => r.emoji === emoji);
    if (recipe) return recipe.name;
    return "Unknown Plant";
  };

  const getSellPrice = (emoji) => {
    const plant = plantTypes.find((p) => p.emoji === emoji);
    if (plant) return plant.cost + 2;
    const livestockItem = livestockItems.find((l) => l.emoji === emoji);
    if (livestockItem) return livestockItem.value;
    const recipe = recipes.find((r) => r.emoji === emoji);
    if (recipe) return recipe.value;
    return 0;
  };
  const calculateChecksum = (data) => {
    const str = JSON.stringify({
      money: data.money,
      level: data.level,
      points: data.points,
      inventory: data.inventory,
      plots: data.plots,
      plotCount: data.plotCount,
      pet: data.pet,
      livestock: data.livestock,
      livestockQuests: data.livestockQuests,
      kitchenQuests: data.kitchenQuests,
      kitchen: data.kitchen,
    });

    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
    }
    return hash;
  };

  // Save game to localStorage
  const saveGame = () => {
    gameState.lastPlayed = new Date().toISOString();
    gameState.checksum = calculateChecksum(gameState);
    localStorage.setItem("emojiFarm", JSON.stringify(gameState));
    updateLastPlayedDisplay();
  };

  // Load game from localStorage
  const loadGame = () => {
    const savedGame = localStorage.getItem("emojiFarm");
    if (savedGame) {
      try {
        const parsed = JSON.parse(savedGame);
        const expectedChecksum = calculateChecksum(parsed);
        let isValid = parsed.checksum === expectedChecksum;

        // Fallback for older saves where 'kitchen' was not part of the checksum
        if (!isValid) {
          const oldStr = JSON.stringify({
            money: parsed.money,
            level: parsed.level,
            points: parsed.points,
            inventory: parsed.inventory,
            plots: parsed.plots,
            plotCount: parsed.plotCount,
            pet: parsed.pet,
            livestock: parsed.livestock,
            livestockQuests: parsed.livestockQuests,
            kitchenQuests: parsed.kitchenQuests,
          });
          let oldHash = 0;
          for (let i = 0; i < oldStr.length; i++) {
            oldHash = ((oldHash << 5) - oldHash + oldStr.charCodeAt(i)) | 0;
          }
          if (parsed.checksum === oldHash) {
            isValid = true;
          }
        }

        if (!isValid) {
          throw new Error("Data tampered");
        }

        // Migrate old save format if needed
        if (!parsed.plots) {
          parsed.plots = Array(parsed.plotCount || 4)
            .fill()
            .map(() => ({ plant: null, growth: 0, plantedAt: null }));
        }

        // Migrate pet to array if it's still a single object
        if (parsed.pet && !Array.isArray(parsed.pet)) {
          parsed.pet = parsed.pet ? [parsed.pet] : [];
          // pastikan array pet hanya 2 item
          if (parsed.pet.length > 2) {
            parsed.pet = parsed.pet.slice(0, 2);
          }
        } else if (!parsed.pet) {
          parsed.pet = [];
        }

        // Migrate livestock if not present
        if (!parsed.livestock) {
          parsed.livestock = [];
        } else {
          // Ensure all livestock have a unique ID
          parsed.livestock.forEach((ls) => {
            if (!ls.id) {
              ls.id =
                "ls_" +
                Date.now() +
                "_" +
                Math.random().toString(36).substr(2, 9);
            }
          });
        }

        // Migrate kitchen if not present or old format
        if (
          !parsed.kitchen ||
          !parsed.kitchen.stations ||
          !Array.isArray(parsed.kitchen.stations)
        ) {
          parsed.kitchen = {
            stations: [null, null, null, null],
            unlockedRecipes: [],
            unlockedCount: 0,
          };
        } else {
          // Ensure unlockedRecipes exists
          if (!parsed.kitchen.unlockedRecipes) {
            parsed.kitchen.unlockedRecipes = [];
          }

          // Ensure unlockedCount exists
          if (!parsed.kitchen.hasOwnProperty("unlockedCount")) {
            parsed.kitchen.unlockedCount = 0;
          }

          if (parsed.kitchen.stations.length !== 6) {
            // Ensure there are always exactly 6 stations
            while (parsed.kitchen.stations.length < 6)
              parsed.kitchen.stations.push(null);
            parsed.kitchen.stations = parsed.kitchen.stations.slice(0, 6);
          }
        }

        // Migrate kitchen quests if not present
        if (!parsed.kitchenQuests) {
          parsed.kitchenQuests = [];
        } else {
          // Fix for emoji mismatch if IDs were stored instead of emojis
          parsed.kitchenQuests.forEach((q) => {
            const recipe = recipes.find((r) => r.id === q.recipeEmoji);
            if (recipe) {
              q.recipeEmoji = recipe.emoji;
            }
          });
        }

        // Migrate quests if not present or old format (single quest)
        if (!parsed.quests) {
          parsed.quests = parsed.quest ? [parsed.quest] : [];
          delete parsed.quest;
        }

        // Migrate questCompletedCount if not present
        if (!parsed.questCompletedCount) {
          parsed.questCompletedCount = parsed.quests.reduce(
            (sum, q) => sum + (q.completedCount || 0),
            0,
          );
        }

        // Migrate level and points if not present
        if (!parsed.level) {
          parsed.level = 1;
        }
        if (!parsed.emoji) {
          parsed.emoji = "notoemoji";
        }
        if (!parsed.points) {
          parsed.points = 0;
        }

        if (parsed.plotCount > 16) {
          parsed.plotCount = 16;
        }

        if (!parsed.hasOwnProperty("music")) {
          parsed.music = true;
        }

        if (!parsed.hasOwnProperty("sfx")) {
          parsed.sfx = true;
        }

        // Ensure each plot has plantedAt property
        parsed.plots.forEach((plot) => {
          if (!plot.plantedAt && plot.plant) {
            plot.plantedAt = new Date().toISOString();
          }
        });

        parsed.money = parsed.money > maxmoney ? maxmoney : parsed.money;

        Object.assign(gameState, parsed);

        document.body.className = gameState.emoji;
        calculateOfflineProgress();
      } catch (e) {
        console.error("Failed to load save:", e);
      }
    }

    // Pastikan ada hingga 3 quest saat memuat
    generateQuests();
    generateLivestockQuests();
    generateKitchenQuests();
    initgarden();
  };

  // Show popup with message and return a Promise
  const showPopup = (message, title = "", btnok = true) => {
    return new Promise((resolve) => {
      title = title == "" ? "Confirm" : title;
      popupTitle.innerHTML = title;
      popupMessage.innerHTML = message;
      popupOverlay.classList.add("show");

      if (btnok) {
        popupConfirm.style.display = "block";
      } else {
        popupConfirm.style.display = "none";
      }

      // Event listener untuk tombol Confirm
      const confirmHandler = () => {
        popupOverlay.classList.remove("show");
        popupConfirm.removeEventListener("click", confirmHandler);
        popupCancel.removeEventListener("click", cancelHandler);
        resolve(true);
      };

      // Event listener untuk tombol Cancel
      const cancelHandler = () => {
        popupOverlay.classList.remove("show");
        popupConfirm.removeEventListener("click", confirmHandler);
        popupCancel.removeEventListener("click", cancelHandler);
        resolve(false);
      };

      popupConfirm.addEventListener("click", confirmHandler);
      popupCancel.addEventListener("click", cancelHandler);
    });
  };

  window.onclick = (event) => {
    // console.log(event.target);
    if (
      !event.target.matches(".plot") &&
      !event.target.matches(".plant") &&
      !event.target.matches(".progress-container") &&
      !event.target.matches(".progress-wrap") &&
      !event.target.matches(".progress-icon") &&
      !event.target.matches(".progress-bar") &&
      !event.target.matches(".farm-grid") &&
      !event.target.matches(".market") &&
      !event.target.matches(".market-items") &&
      !event.target.matches(".market-item") &&
      !event.target.matches(".market-item-emoji") &&
      !event.target.matches(".market-item-name") &&
      !event.target.matches(".market-item-cost") &&
      !event.target.matches("#pet-emoji-container") &&
      !event.target.matches("#pet-emoji")
    ) {
      selectedSeed = null;
      marketbtn.innerHTML = "🌱";
      document
        .querySelectorAll(".market-item")
        .forEach((i) => i.classList.remove("selected"));
    }
  };

  // Menu ==================================================
  _("#menu-inventory").addEventListener("click", async () => {
    _("#wrappets").style.display = "none";
    if (_("#wrapinventory").style.display == "block") {
      _("#wrapinventory").style.display = "none";
    } else {
      _("#wrapinventory").style.display = "block";
    }
  });

  _("#inventory-close").addEventListener("click", () => {
    _("#wrapinventory").style.display = "none";
  });
  _("#menu-pet").addEventListener("click", async () => {
    _("#wrapinventory").style.display = "none";
    if (_("#wrappets").style.display == "block") {
      _("#wrappets").style.display = "none";
    } else {
      _("#wrappets").style.display = "block";
      buyPet();
    }
  });

  _("#pet-close").addEventListener("click", () => {
    _("#wrappets").style.display = "none";
  });

  _("#livestock-market-button").addEventListener("click", async () => {
    if (_("#livestock-market-items").style.display == "flex") {
      _("#livestock-market-items").style.display = "none";
    } else {
      _("#livestock-market-items").style.display = "flex";
    }
  });
  // End Menu ==================================================

  _("#inventory-close").addEventListener("click", () => {
    _("#wrapinventory").style.display = "none";
  });

  let reset = false;
  setting.addEventListener("click", async () => {
    let emofont = document.body.className;
    const set = showPopup(
      `<div style="margin-top:10px">
                Music
                <label class="switch">
                    <input type="checkbox" id="btnmusic" ${gameState.music ? "checked" : ""}>
                    <span class="slider round"></span>
                </label>
            </div>
            <div style="margin-top:10px">
                SFX
                <label class="switch">
                    <input type="checkbox" id="btnsfx" ${gameState.sfx ? "checked" : ""}>
                    <span class="slider round"></span>
                </label>
            </div>
            <div style="margin-top:10px;">
                <div class="custom-select">
                    <div class="selected-option" id="selectedEmoji">
                        <span id="selected-font" class="${emofont}">🌾🌽🪙</span>
                        <span class="arrow">▼</span>
                    </div>
                    <div class="options" id="font-options" style="display:none;">
                        <span class="selectEmoji notoemoji" data="notoemoji">🌾🌽🪙</span>
                        <span class="selectEmoji twemoji" data="twemoji">🌾🌽🪙</span>
                        <span class="selectEmoji openmoji" data="openmoji">🌾🌽🪙</span>
                        <span class="selectEmoji fluentemoji" data="fluentemoji">🌾🌽🪙</span>
                    </div>
                </div>
            </div>
            <button type="button" id="resetgame" style="margin-top:25px">
                Reset Game
            </button>
            <div style="margin-top:15px">
                <span id="help" class="buttonaddition">❓</span>
            </div>
        `,
      "Setting",
      false,
    );

    _("#selectedEmoji").addEventListener("click", () => {
      if (_("#font-options").style.display == "block") {
        _("#font-options").style.display = "none";
      } else {
        _("#font-options").style.display = "block";
      }
    });

    const selectemoji = document.querySelectorAll(".selectEmoji");
    selectemoji.forEach((element) => {
      element.addEventListener("click", function () {
        const attr = element.getAttribute("data");
        _("#font-options").style.display = "none";

        document.getElementById("selected-font").className = attr;
        document.body.className = attr;
        gameState.emoji = attr;
        saveGame();
      });
    });

    _("#help").addEventListener("click", showTutorial);

    _("#btnmusic").addEventListener("click", () => {
      gameState.music = _("#btnmusic").checked;
      if (!_("#btnmusic").checked) {
        music.pause();
      }
      saveGame();
    });

    _("#btnsfx").addEventListener("click", () => {
      gameState.sfx = _("#btnsfx").checked;
      saveGame();
    });

    _("#resetgame").addEventListener("click", async () => {
      const confirmed = await showPopup(`
                Are you sure you want to reset the game? This will erase all progress.<br>
                Type "reset" to confirm.<br><input type="text" id="reset-input" style="width:100px;margin:10px;padding:5px 8px;border-radius:5px;border:2px solid #2E8B57;outline:none;text-align:center;" autocomplete="off">
            `);
      if (confirmed) {
        const resetinput = _("#reset-input").value;
        if (resetinput == "reset") {
          clearInterval(gameInterval);
          localStorage.removeItem("emojiFarm");
          reset = true;
          window.scrollTo(0, 0);
          location.reload();
        } else {
          showNotification(`Failed to reset game!`);
        }
      }
    });
  });

  // Generate new quest
  // Generate single quest
  const generateSingleQuest = () => {
    gameState.questCompletedCount =
      gameState.questCompletedCount == undefined
        ? 0
        : gameState.questCompletedCount;
    const availablePlants = getAvailablePlants(gameState.level).filter(
      (p) => p.emoji !== "🟫",
    );
    let startIndex = 0;
    if (parseInt(gameState.level) >= 6) {
      startIndex =
        parseInt(gameState.level) % 2 === 0
          ? parseInt(gameState.level) - 10
          : parseInt(gameState.level) - 11;
      if (parseInt(gameState.level) > maxplant) {
        startIndex = 5;
      }
    }
    const min = startIndex < 0 ? 2 : startIndex;
    const max = availablePlants.length - 1;
    const numPlant =
      Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) +
      Math.ceil(min);
    const plant = availablePlants[numPlant];
    const baseQuantity =
      gameState.questCompletedCount > 10
        ? Math.floor(Math.random() * 10) + 1
        : Math.floor(Math.random() * 3) + 1;
    const quantity = gameState.level > 6 ? baseQuantity + 2 : baseQuantity;
    const usedNPCs = gameState.quests.map((q) => q.npc);
    const availableNPCs = npcs.filter((npc) => !usedNPCs.includes(npc));
    if (availableNPCs.length === 0) return null; // Cegah quest jika tidak ada NPC
    const npc = availableNPCs[Math.floor(Math.random() * availableNPCs.length)];
    return { npc, plantEmoji: plant.emoji, quantity };
  };

  // Generate quests up to 3
  const generateQuests = () => {
    while (
      gameState.quests.length < 3 &&
      npcs.length > gameState.quests.length
    ) {
      const quest = generateSingleQuest();
      if (quest) gameState.quests.push(quest);
    }
    updateQuestUI();
    updateLivestockQuestUI();
    saveGame();
  };

  // Complete quest by index
  const completeQuest = (index) => {
    const quest = gameState.quests[index];
    const { plantEmoji, quantity } = quest;
    const inventoryCount = gameState.inventory[plantEmoji] || 0;

    if (inventoryCount >= quantity) {
      // Kurangi inventory
      gameState.inventory[plantEmoji] -= quantity;
      if (gameState.inventory[plantEmoji] <= 0) {
        delete gameState.inventory[plantEmoji];
      }

      playSound("done.wav");

      // Tambah poin dan uang
      gameState.points += 2; // 2 poin per quest
      const plantValue = getPlantValue(plantEmoji);
      const reward = plantValue * quantity; // + (gameState.level * 10);
      gameState.money += reward;
      gameState.money = gameState.money > maxmoney ? maxmoney : gameState.money;

      // Tingkatkan questCompletedCount
      gameState.questCompletedCount += 1;

      // Notifikasi dan update
      showNotification(`Quest completed!<br>Gained 🪙${reward}!`);

      // Periksa kenaikan level
      checkLevelUp();

      // Hapus quest dan tambahkan quest baru
      gameState.quests.splice(index, 1);
      generateQuests();

      updateUI();
    } else {
      showNotification(
        `Not enough ${plantEmoji}!<br>Need ${quantity}, have ${inventoryCount}.`,
      );
      // if (_('#market').style.transform == 'translateY(170px)' || _('#market').style.transform == '') {
      //     _('#market').style.transform = 'translateY(0px)';
      // }
      const marketitem = document.querySelectorAll(".market-item");
      var indxe = 0;
      marketitem.forEach((el, i) => {
        if (el.getAttribute("data-emoji") == plantEmoji) {
          indxe = i;
        }
      });
      marketitem[indxe].scrollIntoView({ block: "start", behavior: "smooth" });
    }
  };

  // Update quest UI
  const updateQuestUI = () => {
    questContent.innerHTML = "";

    gameState.quests.forEach((quest, index) => {
      const { npc, plantEmoji, quantity } = quest;
      const inventoryCount = gameState.inventory[plantEmoji] || 0;
      const isCompletable = inventoryCount >= quantity;

      const questItem = document.createElement("div");
      questItem.className = "quest-item";
      questItem.innerHTML = `
                <div class="quest-details">
                    ${quantity} ${plantEmoji}
                </div>
                <span class="quest-button" ${isCompletable ? "" : 'style="display:none;"'}><span class="check-icon"></span></span>
                <div class="quest-npc">${npc}</div>
            `;
      // <br>${getPlantName(plantEmoji)}

      questItem.addEventListener("click", () => completeQuest(index));

      questContent.appendChild(questItem);
    });
  };

  // Generate single livestock quest
  const generateSingleLivestockQuest = () => {
    const item =
      livestockItems[Math.floor(Math.random() * livestockItems.length)];
    const quantity = Math.floor(Math.random() * 5) + 1;
    const usedNPCs = [
      ...gameState.quests.map((q) => q.npc),
      ...gameState.livestockQuests.map((q) => q.npc),
    ];
    const availableNPCs = npcs.filter((npc) => !usedNPCs.includes(npc));
    if (availableNPCs.length === 0) return null;
    const npc = availableNPCs[Math.floor(Math.random() * availableNPCs.length)];
    return { npc, itemEmoji: item.emoji, quantity };
  };

  // Generate livestock quests up to 3
  const generateLivestockQuests = () => {
    while (
      gameState.livestockQuests.length < 3 &&
      npcs.length > gameState.quests.length + gameState.livestockQuests.length
    ) {
      const quest = generateSingleLivestockQuest();
      if (quest) gameState.livestockQuests.push(quest);
      else break;
    }
    updateLivestockQuestUI();
    saveGame();
  };

  // Complete livestock quest by index
  const completeLivestockQuest = (index) => {
    const quest = gameState.livestockQuests[index];
    const { itemEmoji, quantity } = quest;
    const inventoryCount = gameState.inventory[itemEmoji] || 0;

    if (inventoryCount >= quantity) {
      gameState.inventory[itemEmoji] -= quantity;
      if (gameState.inventory[itemEmoji] <= 0) {
        delete gameState.inventory[itemEmoji];
      }

      playSound("done.wav");

      gameState.points += 1; // Livestock quests give more points
      const itemValue = getSellPrice(itemEmoji);
      const reward = (itemValue + 5) * quantity; // Reward
      gameState.money += reward;
      gameState.money = gameState.money > maxmoney ? maxmoney : gameState.money;

      gameState.questCompletedCount += 1;
      showNotification(`Quest completed!<br>Gained 🪙${reward}!`);

      checkLevelUp();
      gameState.livestockQuests.splice(index, 1);
      generateLivestockQuests();
      updateUI();
      updateLivestockUI();
    } else {
      showNotification(
        `Not enough ${itemEmoji}!<br>Need ${quantity}, have ${inventoryCount}.`,
      );
    }
  };

  // Update livestock quest UI
  const updateLivestockQuestUI = () => {
    if (!livestockQuestContent) return;
    livestockQuestContent.innerHTML = "";

    gameState.livestockQuests.forEach((quest, index) => {
      const { npc, itemEmoji, quantity } = quest;
      const inventoryCount = gameState.inventory[itemEmoji] || 0;
      const isCompletable = inventoryCount >= quantity;

      const questItem = document.createElement("div");
      questItem.className = "quest-item ls-quest-item";
      questItem.innerHTML = `
                <div class="quest-details">
                    ${quantity} ${itemEmoji}
                </div>
                <span class="quest-button" ${isCompletable ? "" : 'style="display:none;"'}><span class="check-icon"></span></span>
                <div class="quest-npc">${npc}</div>
            `;

      questItem.addEventListener("click", () => completeLivestockQuest(index));
      livestockQuestContent.appendChild(questItem);
    });
  };

  // Kitchen Quests Logic
  const generateSingleKitchenQuest = () => {
    const unlockedRecipes = gameState.kitchen.unlockedRecipes || [];
    if (unlockedRecipes.length === 0) return null;

    const recipeId =
      unlockedRecipes[Math.floor(Math.random() * unlockedRecipes.length)];
    const recipe = recipes.find((r) => r.id === recipeId);
    const recipeEmoji = recipe ? recipe.emoji : "❓";
    const quantity = Math.floor(Math.random() * 7) + 1; // 1 to 7

    const usedNPCs = [
      ...gameState.quests.map((q) => q.npc),
      ...gameState.livestockQuests.map((q) => q.npc),
      ...gameState.kitchenQuests.map((q) => q.npc),
    ];
    const availableNPCs = npcs.filter((npc) => !usedNPCs.includes(npc));
    if (availableNPCs.length === 0) return null;

    const npc = availableNPCs[Math.floor(Math.random() * availableNPCs.length)];
    return { npc, recipeEmoji, quantity };
  };

  const generateKitchenQuests = () => {
    if (!gameState.kitchenQuests) gameState.kitchenQuests = [];
    while (
      gameState.kitchenQuests.length < 3 &&
      npcs.length >
        gameState.quests.length +
          gameState.livestockQuests.length +
          gameState.kitchenQuests.length
    ) {
      const quest = generateSingleKitchenQuest();
      if (quest) gameState.kitchenQuests.push(quest);
      else break;
    }
    updateKitchenQuestsUI();
    saveGame();
  };

  const completeKitchenQuest = (index) => {
    const quest = gameState.kitchenQuests[index];
    const { recipeEmoji, quantity } = quest;
    const inventoryCount = gameState.inventory[recipeEmoji] || 0;

    if (inventoryCount >= quantity) {
      gameState.inventory[recipeEmoji] -= quantity;
      if (gameState.inventory[recipeEmoji] <= 0) {
        delete gameState.inventory[recipeEmoji];
      }

      playSound("done.wav");

      gameState.points += 1; // Kitchen quests give points
      const recipe = recipes.find((r) => r.emoji === recipeEmoji);
      const reward = (recipe ? recipe.value + 5 : 10) * quantity;
      gameState.money += reward;
      gameState.money = gameState.money > maxmoney ? maxmoney : gameState.money;

      gameState.questCompletedCount += 1;
      showNotification(`Order completed!<br>Gained 🪙${reward}!`);

      checkLevelUp();
      gameState.kitchenQuests.splice(index, 1);
      generateKitchenQuests();
      updateUI();
      updateKitchenStations();
    } else {
      showNotification(
        `Not enough ${recipeEmoji}!<br>Need ${quantity}, have ${inventoryCount}.`,
      );
    }
  };

  const updateKitchenQuestsUI = () => {
    const questList = _("#kitchen-quests");
    if (!questList) return;
    questList.innerHTML = "";

    gameState.kitchenQuests.forEach((quest, index) => {
      const { npc, recipeEmoji, quantity } = quest;
      const inventoryCount = gameState.inventory[recipeEmoji] || 0;
      const isCompletable = inventoryCount >= quantity;

      const questItem = document.createElement("div");
      questItem.className = "quest-item kitchen-quest-item";
      questItem.innerHTML = `
                <div class="quest-details">
                    ${quantity} ${recipeEmoji}
                </div>
                <span class="quest-button" ${isCompletable ? "" : 'style="display:none;"'}><span class="check-icon"></span></span>
                <div class="quest-npc kitchen-quest-npc">${npc}</div>
            `;

      questItem.addEventListener("click", () => completeKitchenQuest(index));
      questList.appendChild(questItem);
    });

    if (gameState.kitchenQuests.length == 0) {
      questList.style.height = "77px";
    }
  };

  // Hitung poin yang dibutuhkan untuk level berikutnya
  const getPointsNeededForNextLevel = (currentLevel) => {
    return 5 * currentLevel; // 5 untuk level 2, 10 untuk level 3, 15 untuk level 4, dst.
  };

  // Periksa dan naikkan level jika poin cukup
  const checkLevelUp = () => {
    let pointsNeeded = getPointsNeededForNextLevel(gameState.level);
    while (gameState.points >= pointsNeeded) {
      gameState.points -= pointsNeeded; // Kurangi poin yang digunakan
      gameState.level += 1; // Naik level
      pointsNeeded = getPointsNeededForNextLevel(gameState.level); // Hitung poin untuk level berikutnya
      showNotification(`Level up!<br>Reached Level ${gameState.level}!`);

      playSound("levelup.wav");

      const numplantnow = parseInt(_(".market-item").length) - 3;
      const availablePlants = getAvailablePlants(gameState.level);
      if (availablePlants.length > numplantnow && numplantnow > 0) {
        setTimeout(() => {
          showNotification(`New Plant Added!`);
        }, 2000);
      }
      populateMarket(); // Perbarui market dengan tanaman baru
    }
  };

  // Fungsi untuk membeli atau mengganti hewan
  const buyPet = async () => {
    const petItems = document.getElementById("pet-items");
    petItems.style.display = "flex";
    petItems.innerHTML = "";

    // Tambahkan tombol untuk membeli atau mengganti hewan
    const actionText = gameState.pet.length < 2 ? "Buy" : "Replace";
    petTypes.forEach((pet) => {
      const item = document.createElement("div");
      item.className = "pet-item";
      item.innerHTML = `
                <div class="market-item-emoji">${pet.emoji}</div>
                <div class="market-item-name">${pet.name}</div>
                <div class="market-item-cost">🪙${pet.cost}</div>
            `;
      item.addEventListener("click", async () => {
        let message = "";
        if (gameState.pet.length < 2) {
          message = `Buy ${pet.name} ${pet.emoji} for 🪙${pet.cost}?`;
        } else {
          let emofont = document.body.className;
          message =
            `Replace a pet with ${pet.name} ${pet.emoji} for 🪙${pet.cost}?<br>` +
            `Choose pet to replace:<br>` +
            `<select id="pet-to-replace" class="${emofont}" style="margin-top:15px;padding:7px 10px;outline:none;border:none;font-size:1.2rem;">
                                 ${gameState.pet.map((p, idx) => `<option value="${idx}">${p.emoji} ${p.id}</option>`).join("")}
                             </select>`;
        }
        const confirmed = await showPopup(message);
        if (confirmed) {
          if (gameState.money >= pet.cost) {
            if (gameState.money - pet.cost >= 50) {
              gameState.money -= pet.cost;
              if (gameState.pet.length < 2) {
                // Tambah hewan baru
                gameState.pet.push({
                  id: pet.id,
                  emoji: pet.emoji,
                  hunger: 100,
                });
                showNotification(`Adopted ${pet.name} ${pet.emoji}!`);
              } else {
                // Ganti hewan yang dipilih
                const replaceIndex = parseInt(_("#pet-to-replace")?.value || 0);
                gameState.pet[replaceIndex] = {
                  id: pet.id,
                  emoji: pet.emoji,
                  hunger: 100,
                };
                showNotification(`Replaced with ${pet.name} ${pet.emoji}!`);
              }
              updatePetUI();
              updateUI();
              petHungerHandler(100);
              saveGame();
              _("#wrappets").style.display = "none";
            } else {
              showNotification(`Can't buy, not good for your 🪙 health`);
            }
          } else {
            showNotification(
              `Not enough 🪙<br>to ${actionText.toLowerCase()} ${pet.emoji}!`,
            );
          }
        }
      });
      petItems.appendChild(item);
    });
  };

  // Fungsi untuk memberi makan hewan
  const feedPet = async () => {
    if (gameState.pet.length === 0) {
      showNotification("No pet to feed!");
      return;
    }

    const options = [
      ...petFoods.map((food) => ({
        type: "buy",
        name: food.name,
        emoji: food.emoji,
        cost: food.cost,
        hungerValue: food.hungerValue,
      })),
      ...petFeedItems.map((item) => ({
        type: "inventory",
        name: getPlantName(item.emoji),
        emoji: item.emoji,
        cost: 0,
        hungerValue: item.hungerValue,
        available: (gameState.inventory[item.emoji] || 0) > 0,
      })),
    ].filter((opt) => opt.type === "buy" || opt.available);

    if (options.length === 0) {
      showNotification(
        "No food available!<br>Buy pet food or harvest more crops.",
      );
      return;
    }

    const message = `
        Feed pet with:<br>
            <div style="text-align:left;margin-top:10px;">
            ${options
              .map(
                (opt) => `
                <div class="feeditem">
                    <input type="radio" name="feed-option" value="${opt.emoji}" id="${opt.emoji}">
                    <label for="${opt.emoji}">${opt.name} ${opt.emoji} (${opt.type === "buy" ? `🪙${opt.cost}` : "From Inventory"})</label>
                </div>
            `,
              )
              .join("")}
            </div>
        `;

    const confirmed = await showPopup(message, "Feed", true, false);
    if (confirmed) {
      const selectedOption = document.querySelector(
        'input[name="feed-option"]:checked',
      );
      if (!selectedOption) {
        showNotification("Please select a food option!");
        return;
      }
      const option = options.find((opt) => opt.emoji === selectedOption.value);
      if (option.type === "buy" && gameState.money < option.cost) {
        showNotification(`Not enough 🪙<br>to buy ${option.emoji}!`);
        return;
      }
      if (option.type === "inventory" && !gameState.inventory[option.emoji]) {
        showNotification(`No ${option.name} in inventory!`);
        return;
      }

      if (option.type === "buy") {
        if (gameState.money - option.cost >= 50) {
          gameState.money -= option.cost;
          _("#love-animation-one").classList.add("love-heart");
          _("#love-animation-two").classList.add("love-heart");
          setTimeout(() => {
            _("#love-animation-one").classList.remove("love-heart");
            _("#love-animation-two").classList.remove("love-heart");
          }, 1500);
        } else {
          showNotification(`can't buy, not good for your 🪙 health`);
          return;
        }
      } else {
        if (gameState.money - option.cost >= 50) {
          gameState.inventory[option.emoji]--;
          if (gameState.inventory[option.emoji] <= 0) {
            delete gameState.inventory[option.emoji];
          }
        } else {
          showNotification(`can't buy, not good for your 🪙 health`);
          return;
        }
      }

      petHungerHandler(option.hungerValue);
      updatePetUI();
      updateUI();
      showNotification(
        `Fed with ${option.name}!<br>Hunger: ${Math.round(gameState.pet[0].hunger)}`,
      );
      saveGame();
      feedPet();
    }
  };

  const petHungerHandler = (num, equal = false) => {
    gameState.pet.forEach((pet, index) => {
      if (equal) {
        gameState.pet[index].hunger = num;
      } else {
        gameState.pet[index].hunger = Math.min(
          Math.max(gameState.pet[index].hunger, 0) + num,
          100,
        );
      }
    });
  };

  // Fungsi untuk memperbarui UI hewan
  const updatePetUI = () => {
    const petEmojiContainerOne = _("#pet-emoji-container-one");
    const petEmojiContainerTwo = _("#pet-emoji-container-two");
    const hungerProgress = _("#hunger-progress");

    if (gameState.pet.length > 0) {
      gameState.pet.forEach((pet, index) => {
        // Perbarui hunger bar
        if (index === 0) {
          const emojiSpan = _("#pet-emoji-one");
          if (emojiSpan.innerHTML !== pet.emoji)
            emojiSpan.innerHTML = pet.emoji;
          if (petEmojiContainerOne.style.display !== "block")
            petEmojiContainerOne.style.display = "block";

          const newClass = "pet-emoji-container pet-emoji-" + pet.id;
          if (petEmojiContainerOne.className !== newClass)
            petEmojiContainerOne.className = newClass;

          if (!petEmojiContainerOne.dataset.listenerAdded) {
            const tapAnim = () => {
              _(`#love-animation-one`).classList.add("love-heart");
              setTimeout(() => {
                _(`#love-animation-one`).classList.remove("love-heart");
              }, 1500);
            };
            petEmojiContainerOne.addEventListener("click", tapAnim);
            petEmojiContainerOne.addEventListener("touchstart", tapAnim);
            petEmojiContainerOne.dataset.listenerAdded = "true";
          }
        } else {
          const emojiSpan = _("#pet-emoji-two");
          if (emojiSpan.innerHTML !== pet.emoji)
            emojiSpan.innerHTML = pet.emoji;

          if (petEmojiContainerTwo.style.display !== "block")
            petEmojiContainerTwo.style.display = "block";

          const newClass = "pet-emoji-container pet-emoji-" + pet.id;
          if (petEmojiContainerTwo.className !== newClass)
            petEmojiContainerTwo.className = newClass;

          if (!petEmojiContainerTwo.dataset.listenerAdded) {
            const tapAnim = () => {
              _(`#love-animation-two`).classList.add("love-heart");
              setTimeout(() => {
                _(`#love-animation-two`).classList.remove("love-heart");
              }, 1500);
            };
            petEmojiContainerTwo.addEventListener("click", tapAnim);
            petEmojiContainerTwo.addEventListener("touchstart", tapAnim);
            petEmojiContainerTwo.dataset.listenerAdded = "true";
          }
        }

        hungerProgress.style.width = `${pet.hunger}%`;
        hungerProgress.style.backgroundColor =
          pet.hunger >= 20 ? "#1b83f2" : "#999";
      });
    } else {
      petEmojiContainerOne.style.display = "none";
      petEmojiContainerTwo.style.display = "none";
    }
  };

  const initLivestock = () => {
    populateLivestockMarket();
  };

  const openLivestockPage = () => {
    _("#farm-button").style.display = "block";
    _("#livestock-container").style.display = "flex";
    updateLivestockQuestUI();
    updateLivestockUI();
  };

  const populateLivestockMarket = () => {
    const container = _("#livestock-market-items");
    container.innerHTML = "";
    livestockTypes.forEach((ls) => {
      const item = document.createElement("div");
      item.className = "ls-market-item";
      item.innerHTML = `
            <div style="font-size:2rem">${ls.emoji}</div>
            <div>${ls.name}</div>
            <div>🪙${ls.cost}</div>
        `;
      item.addEventListener("click", () => buyLivestock(ls.type));
      container.appendChild(item);
    });
  };

  const buyLivestock = async (type) => {
    const lsInfo = livestockTypes.find((l) => l.type === type);
    const currentCount = gameState.livestock.filter(
      (l) => l.type === type,
    ).length;

    if (currentCount >= lsInfo.max) {
      showNotification(`Max ${lsInfo.max} ${lsInfo.emoji}!`);
      return;
    }

    const confirmed = await showPopup(
      `Buy ${lsInfo.name} ${lsInfo.emoji} for 🪙${lsInfo.cost}?`,
    );
    if (confirmed) {
      if (gameState.money >= lsInfo.cost) {
        if (gameState.money - lsInfo.cost >= 50) {
          gameState.money -= lsInfo.cost;
          gameState.livestock.push({
            id:
              "ls_" +
              Date.now() +
              "_" +
              Math.random().toString(36).substr(2, 9),
            type: type,
            emoji: lsInfo.emoji,
            production: 0,
            isProducing: false,
            yieldReady: false,
            x: Math.random() * 80, // percentage
            y: Math.random() * 80, // percentage
            dir: 1,
            yieldCount: 0,
          });
          updateUI();
          updateLivestockUI();
          saveGame();
          showNotification(`${lsInfo.emoji} added!`);
        } else {
          showNotification(`can't buy, not good for your 🪙 health`);
        }
      } else {
        showNotification(`Not enough 🪙<br>to buy ${lsInfo.name}!`);
      }
    }
  };

  const updateLivestockUI = () => {
    const list = _("#livestock-list");
    if (!list) return;

    // --- 1. Cleanup (Remove DOM elements that no longer exist in gameState) ---
    const existingIds = gameState.livestock.map((ls) => ls.id);
    const activeDomElements = list.querySelectorAll(".livestock-item");
    activeDomElements.forEach((el) => {
      const elId = el.id.replace("ls-item-", "");
      if (!existingIds.includes(elId)) {
        el.remove();
      }
    });

    gameState.livestock.forEach((ls) => {
      const lsInfo = livestockTypes.find((l) => l.type === ls.type);
      let item = _(`#ls-item-${ls.id}`);

      // --- 2. Initialization (Create only if not exist) ---
      if (!item) {
        item = document.createElement("div");
        item.id = `ls-item-${ls.id}`;
        item.className = "livestock-item";

        // Emoji container
        const emojiSpan = document.createElement("span");
        emojiSpan.className = "livestock-emoji";
        item.appendChild(emojiSpan);

        // Production bar container
        const barContainer = document.createElement("div");
        barContainer.className = "livestock-status-bars";
        barContainer.id = `ls-bars-${ls.id}`;
        barContainer.innerHTML = `
                <div class="status-bar-bg">
                    <div class="status-bar-fill prod-fill" id="ls-prod-${ls.id}"></div>
                </div>
            `;
        item.appendChild(barContainer);

        // Drag & Click logic
        let isDragging = false;
        let startX, startY;

        const onDragStart = (e) => {
          e.preventDefault();
          const touch = e.type.includes("touch") ? e.touches[0] : e;
          startX = touch.clientX;
          startY = touch.clientY;
          isDragging = false;

          const rect = list.getBoundingClientRect();
          // Always find fresh reference from gameState by ID
          const getLs = () => gameState.livestock.find((l) => l.id === ls.id);
          const currentLs = getLs();
          if (!currentLs) return;

          currentLs.isDragging = true;
          item.classList.add("dragging");

          // Stop current movement towards target
          currentLs.newX = currentLs.x;
          currentLs.newY = currentLs.y;

          const onDragMove = (moveEvent) => {
            const moveTouch = moveEvent.type.includes("touch")
              ? moveEvent.touches[0]
              : moveEvent;
            const dx = moveTouch.clientX - startX;
            const dy = moveTouch.clientY - startY;

            const targetLs = getLs();
            if (!targetLs) return;

            if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
              isDragging = true;
              let newX = targetLs.x + (dx / rect.width) * 100;
              let newY = targetLs.y + (dy / rect.height) * 100;

              // Clamp bounds (0 to 100%)
              newX = Math.max(0, Math.min(100, newX));
              newY = Math.max(0, Math.min(100, newY));

              targetLs.x = newX;
              targetLs.y = newY;

              // Update start position for next frame
              startX = moveTouch.clientX;
              startY = moveTouch.clientY;

              // Update UI immediately for responsiveness
              item.style.left = `calc(${newX}% - 40px)`;
              item.style.top = `calc(${newY}% - 40px)`;
            }
          };

          const onDragEnd = () => {
            document.removeEventListener("mousemove", onDragMove);
            document.removeEventListener("mouseup", onDragEnd);
            document.removeEventListener("touchmove", onDragMove);
            document.removeEventListener("touchend", onDragEnd);

            const targetLs = getLs();
            if (targetLs) {
              targetLs.isDragging = false;
              item.classList.remove("dragging");

              if (!isDragging) {
                // Must find current index because handleLivestockInteraction still uses index
                const idx = gameState.livestock.findIndex(
                  (l) => l.id === ls.id,
                );
                if (idx !== -1) handleLivestockInteraction(idx);
              } else {
                targetLs.newX = Math.max(
                  0,
                  Math.min(80, targetLs.x + (Math.random() * 40 - 20)),
                );
                targetLs.newY = Math.max(
                  0,
                  Math.min(80, targetLs.y + (Math.random() * 40 - 20)),
                );
                targetLs.dir = targetLs.newX > targetLs.x ? -1 : 1;
              }
            }
          };

          document.addEventListener("mousemove", onDragMove);
          document.addEventListener("mouseup", onDragEnd);
          document.addEventListener("touchmove", onDragMove, {
            passive: false,
          });
          document.addEventListener("touchend", onDragEnd);
        };

        item.addEventListener("mousedown", onDragStart);
        item.addEventListener("touchstart", onDragStart, { passive: false });

        list.appendChild(item);
      }

      if (ls.isProducing) {
        _(`#ls-bars-${ls.id}`).style.display = "block";
      } else {
        _(`#ls-bars-${ls.id}`).style.display = "none";
      }

      // --- 3. Update (Frequent property sync) ---
      item.style.left = `calc(${ls.x}% - 40px)`;
      item.style.top = `calc(${ls.y}% - 40px)`;

      const emojiEl = item.querySelector(".livestock-emoji");
      if (emojiEl.textContent !== ls.emoji) emojiEl.textContent = ls.emoji;

      const transformStr = `scaleX(${ls.dir})`;
      if (emojiEl.style.transform !== transformStr)
        emojiEl.style.transform = transformStr;

      if (!emojiEl.classList.contains("emoji-" + ls.type)) {
        emojiEl.classList.remove("emoji-cow", "emoji-chicken");
        emojiEl.classList.add("emoji-" + ls.type);
      }

      const prodFill = _(`#ls-prod-${ls.id}`);
      const prodProgress = (ls.production / lsInfo.growthTime) * 100;
      const widthStr = `${prodProgress}%`;
      if (prodFill.style.width !== widthStr) prodFill.style.width = widthStr;

      // Ready badge logic
      let badge = item.querySelector(".ready-badge");
      if (ls.yieldReady) {
        _(`#ls-bars-${ls.id}`).style.display = "none";
        if (!badge) {
          badge = document.createElement("div");
          badge.className = "ready-badge";
          badge.textContent = lsInfo.yield;
          item.appendChild(badge);
        }
      } else if (badge) {
        badge.remove();
      }
    });
  };

  const handleLivestockInteraction = async (index) => {
    const ls = gameState.livestock[index];
    const lsInfo = livestockTypes.find((l) => l.type === ls.type);

    if (ls.yieldReady) {
      collectLivestockYield(index);
      return;
    }

    const lvstck = showPopup(
      `<button class="popup-button" id="feedls" style="margin-right:20px;">
        <span style="font-size:25px;">${lsInfo.food}</span>
        <br>Feed
    </button>

    <button class="popup-button" id="putls">
        <span style="font-size:25px;">${lsInfo.meat}</span>
        <br>Put
    </button>`,
      "Livestock " + ls.emoji,
      false,
    );

    _("#feedls").addEventListener("click", () => {
      feedLivestock(index);
      _("#popup-cancel").click();
    });

    _("#putls").addEventListener("click", () => {
      putLivestock(index);
    });
  };

  const putLivestock = async (index) => {
    const ls = gameState.livestock[index];
    const lsInfo = livestockTypes.find((l) => l.type === ls.type);

    const currentYields = ls.yieldCount || 0;
    if (currentYields < lsInfo.minYieldsToSlaughter) {
      const remaining = lsInfo.minYieldsToSlaughter - currentYields;
      showNotification(
        `${ls.emoji} needs to produce ${lsInfo.yield}<br>${remaining} more time(s)!`,
      );
      return;
    }

    // Slaughter check - using double confirmation for safety
    const slaughter = await showPopup(
      `Put ${ls.emoji} to get ${lsInfo.meat}?`,
      "Confirm",
    );
    if (slaughter) slaughterLivestock(index);
  };

  const feedLivestock = (index) => {
    const ls = gameState.livestock[index];
    const lsInfo = livestockTypes.find((l) => l.type === ls.type);
    let feed = false;
    if ((gameState.inventory[lsInfo.food] || 0) > 0) {
      if (ls.isProducing == false) {
        if (
          lsInfo.type == "cow" &&
          (gameState.inventory[lsInfo.food] || 0) >= 3
        ) {
          gameState.inventory[lsInfo.food] -= 3;
          feed = true;
          playSound("cow.wav");
        } else if (
          lsInfo.type == "chicken" &&
          (gameState.inventory[lsInfo.food] || 0) >= 1
        ) {
          gameState.inventory[lsInfo.food]--;
          feed = true;
          playSound("chicken.wav");
        }

        if (feed) {
          if (gameState.inventory[lsInfo.food] <= 0)
            delete gameState.inventory[lsInfo.food];

          ls.isProducing = true;

          updateUI();
          updateLivestockUI();
          saveGame();
          showNotification(`${ls.emoji} feeded!`);
        } else {
          showNotification(
            `Need ${lsInfo.type == "cow" ? "3" : "1"} ${lsInfo.food}!`,
          );
        }
      } else {
        showNotification(`${ls.emoji} has been fed!`);
      }
    } else {
      showNotification(
        `Need ${lsInfo.type == "cow" ? "3" : "1"} ${lsInfo.food}!`,
      );
    }
  };

  const collectLivestockYield = (index) => {
    const ls = gameState.livestock[index];
    const lsInfo = livestockTypes.find((l) => l.type === ls.type);

    if (!gameState.inventory[lsInfo.yield])
      gameState.inventory[lsInfo.yield] = 0;
    gameState.inventory[lsInfo.yield]++;

    ls.yieldReady = false;
    ls.production = 0;
    ls.isProducing = false;

    if (ls.yieldCount === undefined) ls.yieldCount = 0;
    ls.yieldCount++;
    playSound("tap.wav");

    updateUI();
    updateLivestockUI();
    updateLivestockQuestUI();
    saveGame();
    showNotification(`Got ${lsInfo.yield}`);
  };

  const slaughterLivestock = (index) => {
    const ls = gameState.livestock[index];
    const lsInfo = livestockTypes.find((l) => l.type === ls.type);

    if (!gameState.inventory[lsInfo.meat]) gameState.inventory[lsInfo.meat] = 0;
    if (lsInfo.type === "cow") {
      gameState.inventory[lsInfo.meat] += 5;
    } else {
      gameState.inventory[lsInfo.meat] += 3;
    }

    gameState.livestock.splice(index, 1);

    updateUI();
    updateLivestockUI();
    updateLivestockQuestUI();
    saveGame();
    showNotification(`Put ${ls.emoji} for ${lsInfo.meat}!`);
  };

  // Fungsi untuk panen otomatis
  const autoHarvest = () => {
    if (
      (gameState.pet.length > 0 && gameState.pet[0].hunger < 20) ||
      gameState.pet.length <= 0
    ) {
      return;
    }

    const readyPlotIndex = gameState.plots.findIndex(
      (plot, index) => plot.plant && isReadyToHarvest(index),
    );
    if (readyPlotIndex !== -1) {
      harvestPlant(readyPlotIndex, true);
      // showNotification(`${gameState.pet.emoji} harvested a plant!`);
    }
  };

  _("#feed-pet").addEventListener("click", feedPet);

  // Save game when page is closed
  window.addEventListener("beforeunload", () => {
    if (!reset) {
      saveGame();
    }
  });

  // ==========================================================================
  // ==========================================================================
  // Minigame state
  const minigameState = {
    gridSize: 6,
    grid: [],
    moves: 20,
    score: 0,
    targetScore: 500,
    selectedCell: null,
    isProcessing: false,
    maxPlants: 5, // Maksimum jenis tanaman di grid
  };

  // Initialize minigame
  const initMinigame = () => {
    minigameState.grid = [];
    minigameState.moves =
      gameState.level < 20 ? 20 : Math.min(gameState.level, maxplant);
    minigameState.score = 0;
    minigameState.selectedCell = null;
    minigameState.isProcessing = false;
    generateMinigameGrid();
    updateMinigameUI();
  };

  // Generate minigame grid
  let lvpln = gameState.level;
  const generateMinigameGrid = () => {
    const getavailablePlants = getAvailablePlants(lvpln).filter(
      (p) => p.emoji !== "🟫",
    );
    const availablePlants = getavailablePlants.reverse();
    const plantPool = availablePlants.slice(
      0,
      Math.min(minigameState.maxPlants, availablePlants.length),
    );
    minigameState.grid = [];

    for (let i = 0; i < minigameState.gridSize; i++) {
      minigameState.grid[i] = [];
      for (let j = 0; j < minigameState.gridSize; j++) {
        let emoji;
        let attempts = 0;
        const maxAttempts = 10; // Batasi jumlah percobaan untuk mencegah loop tak terbatas

        do {
          emoji = plantPool[Math.floor(Math.random() * plantPool.length)].emoji; // Perbaiki _ddd menjadi emoji
          attempts++;
          // Periksa apakah emoji membentuk tiga kecocokan berturut-turut
          if (attempts >= maxAttempts) {
            // Jika terlalu banyak percobaan, gunakan emoji acak untuk keluar dari loop
            break;
          }
        } while (
          (i >= 2 &&
            minigameState.grid[i - 1][j]?.emoji === emoji &&
            minigameState.grid[i - 2][j]?.emoji === emoji) ||
          (j >= 2 &&
            minigameState.grid[i][j - 1]?.emoji === emoji &&
            minigameState.grid[i][j - 2]?.emoji === emoji)
        );

        minigameState.grid[i][j] = { emoji, matched: false };
      }
    }
  };

  // Update minigame UI
  const updateMinigameUI = () => {
    const gridElement = _("#minigame-grid");
    gridElement.innerHTML = "";
    for (let i = 0; i < minigameState.gridSize; i++) {
      for (let j = 0; j < minigameState.gridSize; j++) {
        const cell = document.createElement("div");
        cell.className = "min-emoji minigame-cell";
        cell.dataset.row = i;
        cell.dataset.col = j;
        cell.textContent = minigameState.grid[i][j].emoji;
        if (minigameState.grid[i][j].matched) {
          cell.classList.add("matched");
        }
        cell.addEventListener("click", () => handleMinigameCellClick(i, j));
        gridElement.appendChild(cell);
      }
    }
    _("#minigame-score").textContent = minigameState.score;
    _("#minigame-moves").textContent = minigameState.moves;
  };

  // Handle cell click
  const handleMinigameCellClick = (row, col) => {
    if (minigameState.isProcessing || minigameState.moves <= 0) return;

    const cellElement = document.querySelector(
      `.minigame-cell[data-row="${row}"][data-col="${col}"]`,
    );
    if (!minigameState.selectedCell) {
      minigameState.selectedCell = { row, col };
      cellElement.classList.add("selected");
    } else {
      const { row: prevRow, col: prevCol } = minigameState.selectedCell;
      const prevCellElement = document.querySelector(
        `.minigame-cell[data-row="${prevRow}"][data-col="${prevCol}"]`,
      );
      prevCellElement.classList.remove("selected");

      // Periksa apakah cell berdekatan
      if (Math.abs(row - prevRow) + Math.abs(col - prevCol) === 1) {
        minigameState.isProcessing = true;
        swapCells(prevRow, prevCol, row, col, () => {
          const matches = findMatches();
          if (matches.length > 0) {
            minigameState.moves--;
            processMatches(matches);
          } else {
            // Swap back if no matches
            swapCells(prevRow, prevCol, row, col, () => {
              minigameState.isProcessing = false;
            });
          }
        });
      }
      minigameState.selectedCell = null;
    }
  };

  // Swap two cells with animation
  const swapCells = (row1, col1, row2, col2, callback) => {
    const cell1 = document.querySelector(
      `.minigame-cell[data-row="${row1}"][data-col="${col1}"]`,
    );
    const cell2 = document.querySelector(
      `.minigame-cell[data-row="${row2}"][data-col="${col2}"]`,
    );

    // Tentukan arah animasi berdasarkan posisi
    let class1, class2;
    if (row1 === row2) {
      // Pertukaran horizontal
      class1 = col1 < col2 ? "swap-right" : "swap-left";
      class2 = col1 < col2 ? "swap-left" : "swap-right";
    } else {
      // Pertukaran vertikal
      class1 = row1 < row2 ? "swap-down" : "swap-up";
      class2 = row1 < row2 ? "swap-up" : "swap-down";
    }

    // Terapkan kelas animasi
    cell1.classList.add(class1);
    cell2.classList.add(class2);

    // Tunggu animasi selesai
    setTimeout(() => {
      // Hapus kelas animasi
      cell1.classList.remove(class1);
      cell2.classList.remove(class2);

      // Lakukan pertukaran data
      const temp = minigameState.grid[row1][col1];
      minigameState.grid[row1][col1] = minigameState.grid[row2][col2];
      minigameState.grid[row2][col2] = temp;

      // Perbarui UI
      updateMinigameUI();

      // Panggil callback jika ada
      if (callback) callback();
    }, 300); // Sesuaikan dengan durasi animasi (0.3s)
  };

  // Find matches (3 or more in a row or column)
  // Find matches (3 or more in a row or column) and group them
  const findMatches = () => {
    const matches = [];

    // Check rows
    for (let i = 0; i < minigameState.gridSize; i++) {
      let count = 1;
      let startCol = 0;
      let currentEmoji = minigameState.grid[i][0]?.emoji;
      for (let j = 1; j <= minigameState.gridSize; j++) {
        if (
          j < minigameState.gridSize &&
          minigameState.grid[i][j]?.emoji === currentEmoji
        ) {
          count++;
        } else {
          if (count >= 3) {
            const group = [];
            for (let k = startCol; k < startCol + count; k++) {
              group.push({ row: i, col: k });
            }
            matches.push({ cells: group, count, emoji: currentEmoji });
          }
          count = 1;
          startCol = j;
          currentEmoji =
            j < minigameState.gridSize ? minigameState.grid[i][j]?.emoji : null;
        }
      }
    }

    // Check columns
    for (let j = 0; j < minigameState.gridSize; j++) {
      let count = 1;
      let startRow = 0;
      let currentEmoji = minigameState.grid[0][j]?.emoji;
      for (let i = 1; i <= minigameState.gridSize; i++) {
        if (
          i < minigameState.gridSize &&
          minigameState.grid[i][j]?.emoji === currentEmoji
        ) {
          count++;
        } else {
          if (count >= 3) {
            const group = [];
            for (let k = startRow; k < startRow + count; k++) {
              group.push({ row: k, col: j });
            }
            matches.push({ cells: group, count, emoji: currentEmoji });
          }
          count = 1;
          startRow = i;
          currentEmoji =
            i < minigameState.gridSize ? minigameState.grid[i][j]?.emoji : null;
        }
      }
    }

    return matches;
  };

  // Check if there are possible matches in the grid
  const hasPossibleMatches = () => {
    for (let i = 0; i < minigameState.gridSize; i++) {
      for (let j = 0; j < minigameState.gridSize; j++) {
        const currentEmoji = minigameState.grid[i][j].emoji;

        // Check right swap
        if (j < minigameState.gridSize - 1) {
          const rightEmoji = minigameState.grid[i][j + 1].emoji;
          // Swap temporarily
          minigameState.grid[i][j].emoji = rightEmoji;
          minigameState.grid[i][j + 1].emoji = currentEmoji;
          const matches = findMatches();
          // Undo swap
          minigameState.grid[i][j].emoji = currentEmoji;
          minigameState.grid[i][j + 1].emoji = rightEmoji;
          if (matches.length > 0) return true;
        }

        // Check down swap
        if (i < minigameState.gridSize - 1) {
          const downEmoji = minigameState.grid[i + 1][j].emoji;
          // Swap temporarily
          minigameState.grid[i][j].emoji = downEmoji;
          minigameState.grid[i + 1][j].emoji = currentEmoji;
          const matches = findMatches();
          // Undo swap
          minigameState.grid[i][j].emoji = currentEmoji;
          minigameState.grid[i + 1][j].emoji = downEmoji;
          if (matches.length > 0) return true;
        }
      }
    }
    return false;
  };

  // Process matches
  // Process matches with sound and inventory reward
  const processMatches = async (matches) => {
    // Tandai cell yang cocok
    matches.forEach((match) => {
      match.cells.forEach(({ row, col }) => {
        minigameState.grid[row][col].matched = true;
      });
    });
    updateMinigameUI();

    // Hitung skor dan tambahkan tanaman ke inventaris
    let totalPoints = 0;
    matches.forEach((match) => {
      const matchCount = match.count;
      let points = 0;
      if (matchCount === 3) points = 10;
      else if (matchCount === 4) points = 20;
      else if (matchCount >= 5) points = 30;
      totalPoints += points;

      // Tambahkan tanaman ke inventaris jika kecocokan 4 atau lebih
      if (matchCount >= 4) {
        const matchedEmoji = match.emoji;
        gameState.inventory[matchedEmoji] =
          (gameState.inventory[matchedEmoji] || 0) + 1;
        const plantName = getPlantName(matchedEmoji);
        showNotification(`Got 1 ${plantName} ${matchedEmoji}!`);
        updateUI();
        saveGame();
      }
    });
    minigameState.score += totalPoints;

    // Putar efek suara kecocokan
    playSound("match.wav");

    // Tunggu animasi selesai
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Hapus cell yang cocok dan isi ulang grid
    dropCells();
    fillGrid();
    updateMinigameUI();

    // Periksa apakah ada match baru
    const newMatches = findMatches();
    if (newMatches.length > 0) {
      await processMatches(newMatches);
    } else {
      minigameState.isProcessing = false;
      // Periksa deadlock
      if (!hasPossibleMatches()) {
        await checkMinigameEnd(true);
      } else {
        checkMinigameEnd();
      }
    }
  };

  // Drop cells to fill gaps
  const dropCells = () => {
    for (let j = 0; j < minigameState.gridSize; j++) {
      let emptyRow = minigameState.gridSize - 1;
      for (let i = minigameState.gridSize - 1; i >= 0; i--) {
        if (!minigameState.grid[i][j].matched) {
          minigameState.grid[emptyRow][j] = minigameState.grid[i][j];
          emptyRow--;
        }
      }
      // Tandai slot kosong
      for (let i = emptyRow; i >= 0; i--) {
        minigameState.grid[i][j] = { emoji: "", matched: true };
      }
    }
  };

  // Fill empty slots with new plants
  const fillGrid = () => {
    const getavailablePlants = getAvailablePlants(lvpln).filter(
      (p) => p.emoji !== "🟫",
    );
    const availablePlants = getavailablePlants.reverse();
    const plantPool = availablePlants.slice(
      0,
      Math.min(minigameState.maxPlants, availablePlants.length),
    );
    for (let i = 0; i < minigameState.gridSize; i++) {
      for (let j = 0; j < minigameState.gridSize; j++) {
        if (minigameState.grid[i][j].matched) {
          minigameState.grid[i][j] = {
            emoji:
              plantPool[Math.floor(Math.random() * plantPool.length)].emoji,
            matched: false,
          };
        }
      }
    }
  };

  // Check if minigame is over
  const checkMinigameEnd = async (isDeadlock = false) => {
    if (
      minigameState.moves <= 0 ||
      minigameState.score >= minigameState.targetScore ||
      isDeadlock
    ) {
      let message = "";
      let reward = 0;

      if (minigameState.score >= minigameState.targetScore) {
        reward = 10; // Math.floor(minigameState.score / 10);
        message = `Great job!<br>You scored ${minigameState.score} points!<br>Reward: 🪙${reward}!`;
      } else if (isDeadlock) {
        message = `Game over!<br>No more moves possible!<br>You scored ${minigameState.score} points.`;
      } else {
        message = `Game over!<br>You scored ${minigameState.score} points.`;
        // reward = Math.floor(minigameState.score / 15);
      }

      gameState.money += reward;
      gameState.money = Math.min(gameState.money, maxmoney);
      updateUI();
      saveGame();

      const rewardMessage = `${message}`;

      await showPopup(rewardMessage, "Result");
      _("#minigame-popup-overlay").classList.remove("show");
    }
  };

  // Open minigame
  const openMinigame = async () => {
    const levelrequire = 5;
    if (gameState.level >= levelrequire) {
      lvpln =
        gameState.level >= 25
          ? Math.floor(
              Math.random() * (Math.min(gameState.level, maxplant) - 10 + 1),
            ) + 10
          : gameState.level;
      const availablePlants = getAvailablePlants(lvpln).filter(
        (p) => p.emoji !== "🟫",
      );
      availablePlants.sort((a, b) => b.cost - a.cost);
      let entryCost = availablePlants[0].cost * 10;
      const confirmed = await showPopup(`Play Plant Match for 🪙${entryCost}?`);
      if (confirmed) {
        if (gameState.money >= entryCost) {
          if (gameState.money - entryCost >= 50) {
            gameState.money -= entryCost;
            updateUI();
            saveGame();
            initMinigame();
            _("#minigame-popup-overlay").classList.add("show");
          } else {
            showNotification(`Can't play, not good for your 🪙 health`);
          }
        } else {
          showNotification(`Not enough 🪙<br>to play!`);
        }
      }
    } else {
      showPopup(
        `Plant Match can be played at level ${levelrequire}`,
        "Level Requirement",
        false,
      );
    }
  };

  // Event listeners for minigame
  _("#play-minigame").addEventListener("click", openMinigame);
  _("#minigame-close").addEventListener("click", async () => {
    const confirmed = await showPopup(
      `Close Plant Match without finishing it will not return your 🪙.<br>Are you sure to close it?`,
    );
    if (confirmed) {
      _("#minigame-popup-overlay").classList.remove("show");
    }
  });
  // ==========================================================================
  // ==========================================================================
  // ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
  // ==========================================================================
  // ==========================================================================

  const Engine = Matter.Engine,
    Runner = Matter.Runner,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Events = Matter.Events;

  // Game constants
  let EMOJI_SEQUENCE = [];
  const EMOJI_SIZES = [35, 45, 55, 65, 75, 85, 95, 105, 115];
  const WALL_THICKNESS = 15;
  const DANGER_ZONE_Y = 60;
  const UPDATE_INTERVAL = 33;

  // Game variables
  let score = 0;
  let nextEmojiIndex = 0;
  let nextEmojiTemp = 0;
  let gameStarted = false;
  let merging = false;
  let isGameOver = false;
  let canSpawn = true;
  let previewElement = null;
  let lastPositionX = 0;

  // DOM elements
  const scoreElement = document.getElementById("dropcrops-score");
  const nextEmojiElement = document.getElementById("dropcrops-next");
  const gameCanvas = document.getElementById("dropcrops-canvas");

  // Danger zone
  const dangerZone = document.createElement("div");
  dangerZone.className = "danger-zone";
  gameCanvas.appendChild(dangerZone);

  // Create engine
  const engine = Engine.create({
    gravity: { x: 0, y: 1, scale: 0.001 },
    constraintIterations: 2,
    positionIterations: 4,
    velocityIterations: 4,
    enableSleeping: true,
  });

  const canvasWidth = 300;
  const canvasHeight = 350;

  // Create walls
  const walls = [
    // bottom
    Bodies.rectangle(
      canvasWidth / 2,
      canvasHeight + WALL_THICKNESS / 2 - 5,
      canvasWidth,
      WALL_THICKNESS,
      { isStatic: true, friction: 0, render: { visible: false } },
    ),
    // left
    Bodies.rectangle(
      -WALL_THICKNESS / 2,
      canvasHeight / 2,
      WALL_THICKNESS - 10,
      canvasHeight,
      { isStatic: true, friction: 0, render: { visible: false } },
    ),
    // right
    Bodies.rectangle(
      canvasWidth + WALL_THICKNESS / 2 - 5,
      canvasHeight / 2,
      WALL_THICKNESS,
      canvasHeight,
      { isStatic: true, friction: 0, render: { visible: false } },
    ),
  ];
  World.add(engine.world, walls);

  // Hidden renderer
  const render = Render.create({
    element: gameCanvas,
    engine: engine,
    options: {
      width: canvasWidth,
      height: canvasHeight,
      wireframes: false,
      background: "transparent",
      visible: false,
    },
  });

  const runner = Runner.create({ delta: 16.67 });
  Runner.run(runner, engine);

  const emojiBodies = new Map();
  let lastUpdateTime = performance.now();

  const getRandomEmojiIndex = () => {
    const weights = [0.4, 0.3, 0.15, 0.08, 0.05, 0.02];
    let rand = Math.random(),
      sum = 0;
    for (let i = 0; i < weights.length; i++) {
      sum += weights[i];
      if (rand <= sum) return i;
    }
    return 0;
  };

  const createEmoji = (x, y, emojiIndex) => {
    if (isGameOver) {
      // console.log('Game over, cannot spawn emoji');
      return null;
    }

    const size = EMOJI_SIZES[emojiIndex];
    const emoji = EMOJI_SEQUENCE[emojiIndex];

    const body = Bodies.circle(x, y, size / 2, {
      restitution: 0.1,
      friction: 0.5,
      density: 0.001 * size,
      render: { visible: false },
      label: `emoji-${emojiIndex}`,
      sleepThreshold: 60,
    });

    emojiBodies.set(body, {
      emoji,
      index: emojiIndex,
      element: null,
      merged: false,
    });

    World.add(engine.world, body);
    createEmojiElement(body);
    // console.log(`Created emoji: ${emoji} at (${x}, ${y}) with size ${size}`);
    return body;
  };

  const createEmojiElement = (body) => {
    const emojiData = emojiBodies.get(body);
    if (!emojiData) {
      console.error("No emoji data for body");
      return;
    }

    const element = document.createElement("div");
    element.className = "emoji";
    element.textContent = emojiData.emoji;
    element.style.fontSize = `${EMOJI_SIZES[emojiData.index]}px`;
    element.style.zIndex = "20";
    gameCanvas.appendChild(element);
    emojiData.element = element;
    updateEmojiElementPosition(body);
    // console.log(`Created DOM element for emoji: ${emojiData.emoji}`);
  };

  const updateEmojiElementPosition = (body) => {
    const emojiData = emojiBodies.get(body);
    if (!emojiData || !emojiData.element) return;

    const element = emojiData.element;
    const size = EMOJI_SIZES[emojiData.index];
    element.style.left = `${body.position.x - size / 2}px`;
    element.style.top = `${body.position.y - size / 2}px`;
    element.style.transform = `rotate(${body.angle}rad)`;
  };

  // Create preview element
  const createPreviewElement = () => {
    if (previewElement) return;
    previewElement = document.createElement("div");
    previewElement.className = "emoji-preview";
    previewElement.style.fontSize = `${EMOJI_SIZES[nextEmojiIndex]}px`;
    previewElement.style.zIndex = "25";
    previewElement.textContent = EMOJI_SEQUENCE[nextEmojiIndex];
    gameCanvas.appendChild(previewElement);
    // console.log('Created preview element');
  };

  // Update preview position
  const updatePreviewPosition = (x) => {
    if (!previewElement || isGameOver) return;
    const size = EMOJI_SIZES[nextEmojiIndex];
    // Batasi posisi x agar tetap di dalam canvas
    const clampedX =
      Math.max(size / 2, Math.min(canvasWidth - size / 2, x)) + 5;
    previewElement.style.left = `${clampedX - size / 2 - WALL_THICKNESS}px`;
    previewElement.style.top = `30px`; // Tetap di tengah danger zone
    previewElement.textContent = EMOJI_SEQUENCE[nextEmojiIndex];
    previewElement.style.fontSize = `${EMOJI_SIZES[nextEmojiIndex]}px`;
  };

  // Remove preview element
  const removePreviewElement = () => {
    if (previewElement) {
      previewElement.remove();
      previewElement = null;
      // console.log('Removed preview element');
    }
  };

  Events.on(engine, "collisionStart", function (event) {
    if (merging || isGameOver) return;

    const pairs = event.pairs;
    for (let pair of pairs) {
      if (
        pair.bodyA.label.startsWith("emoji-") &&
        pair.bodyB.label.startsWith("emoji-")
      ) {
        const bodyA = pair.bodyA;
        const bodyB = pair.bodyB;

        if (bodyA.isSleeping && bodyB.isSleeping) continue;

        const emojiDataA = emojiBodies.get(bodyA);
        const emojiDataB = emojiBodies.get(bodyB);

        if (
          emojiDataA &&
          emojiDataB &&
          emojiDataA.index === emojiDataB.index &&
          !emojiDataA.merged &&
          !emojiDataB.merged &&
          emojiDataA.index < EMOJI_SEQUENCE.length - 1
        ) {
          merging = true;
          mergeEmojis(bodyA, bodyB);
          merging = false;
        }
      }
    }
  });

  const mergeEmojis = (bodyA, bodyB) => {
    const emojiDataA = emojiBodies.get(bodyA);
    const emojiDataB = emojiBodies.get(bodyB);

    if (!emojiDataA || !emojiDataB || emojiDataA.merged || emojiDataB.merged)
      return;

    const mergeX = (bodyA.position.x + bodyB.position.x) / 2;
    const mergeY = (bodyA.position.y + bodyB.position.y) / 2;

    removeEmoji(bodyA);
    removeEmoji(bodyB);

    const newEmojiIndex = emojiDataA.index + 1;
    const newBody = createEmoji(mergeX, mergeY, newEmojiIndex);

    playSound("match.wav");
    if (newEmojiIndex === EMOJI_SEQUENCE.length - 1) {
      gameOver(true);
      return;
    }

    score += (newEmojiIndex + 1) * 10;
    scoreElement.textContent = score;

    if (newBody) {
      Body.applyForce(newBody, newBody.position, {
        x: (Math.random() - 0.5) * 0.01,
        y: -0.02,
      });
    }
  };

  const removeEmoji = (body) => {
    const emojiData = emojiBodies.get(body);
    if (!emojiData) return;

    emojiData.merged = true;
    if (emojiData.element) {
      emojiData.element.remove();
      // console.log(`Removed emoji: ${emojiData.emoji}`);
    }
    World.remove(engine.world, body);
    emojiBodies.delete(body);
  };

  const updateNextEmoji = () => {
    if (!gameStarted) {
      nextEmojiIndex = getRandomEmojiIndex();
    } else {
      nextEmojiIndex = nextEmojiTemp;
    }
    nextEmojiTemp = getRandomEmojiIndex();
    nextEmojiElement.textContent = EMOJI_SEQUENCE[nextEmojiTemp];
    if (previewElement) {
      previewElement.textContent = EMOJI_SEQUENCE[nextEmojiIndex];
      previewElement.style.fontSize = `${EMOJI_SIZES[nextEmojiIndex]}px`;
    }
    setTimeout(() => {
      updatePreviewPosition(lastPositionX);
    }, 300);
  };

  const spawnEmoji = (x) => {
    if (!gameStarted) {
      return;
    }
    if (!canSpawn || isGameOver) {
      // console.log('Cannot spawn: canSpawn=', canSpawn, 'isGameOver=', isGameOver);
      return;
    }

    canSpawn = false;
    setTimeout(() => (canSpawn = true), 500);

    // console.log(`Spawning emoji at x=${x}`);
    removePreviewElement(); // Hapus preview sebelum spawn
    createEmoji(x, 50, nextEmojiIndex);
    updateNextEmoji();
    createPreviewElement(); // Buat preview baru setelah spawn
  };

  // Event handlers untuk preview
  gameCanvas.addEventListener("mousemove", function (e) {
    if (isGameOver || !canSpawn) return;
    const rect = gameCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (!previewElement) createPreviewElement();
    lastPositionX = x;
    updatePreviewPosition(x);
  });

  gameCanvas.addEventListener("touchmove", function (e) {
    if (isGameOver || !canSpawn) return;
    e.preventDefault();
    const rect = gameCanvas.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    if (!previewElement) createPreviewElement();
    lastPositionX = x;
    updatePreviewPosition(x);
  });

  gameCanvas.addEventListener("click", function (e) {
    if (!canSpawn || isGameOver) return;
    const rect = gameCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    // console.log(`Click at x=${x}`);
    spawnEmoji(x);
  });

  gameCanvas.addEventListener("touchstart", function (e) {
    if (!canSpawn || isGameOver) return;
    e.preventDefault();
    const rect = gameCanvas.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    lastPositionX = x;
  });

  gameCanvas.addEventListener("touchend", function (e) {
    if (!canSpawn || isGameOver) return;
    e.preventDefault();
    spawnEmoji(lastPositionX);
  });

  const gameLoop = (timestamp) => {
    if (isGameOver) return;

    if (timestamp - lastUpdateTime >= UPDATE_INTERVAL) {
      let dangerZoneActive = false;
      emojiBodies.forEach((data, body) => {
        if (body.isSleeping) return;

        updateEmojiElementPosition(body);

        if (body.position.y < DANGER_ZONE_Y + 15 && body.speed < 0.1) {
          // console.log('Game over triggered: emoji in danger zone');
          gameOver();
          return;
        }
        if (body.position.y < DANGER_ZONE_Y) {
          dangerZoneActive = true;
        }

        if (
          body.position.y > canvasHeight + 100 ||
          body.position.x < -100 ||
          body.position.x > canvasWidth + 100
        ) {
          removeEmoji(body);
        }
      });

      lastUpdateTime = timestamp;
    }

    requestAnimationFrame(gameLoop);
  };

  const startGame = () => {
    const dropcropsgrid = document.getElementById("dropcrops-container");
    const gameOverDiv = document.createElement("div");
    gameOverDiv.className = "game-over";
    gameOverDiv.style.display = "flex";
    gameOverDiv.innerHTML = `
            <button class="restart-btn" id="startgame">Start Game</button>
        `;
    dropcropsgrid.appendChild(gameOverDiv);

    gameOverDiv
      .querySelector("#startgame")
      .addEventListener("click", function () {
        dropcropsgrid.removeChild(gameOverDiv);
        if (isGameOver) {
          updateNextEmoji();
          isGameOver = false;
          setTimeout(() => {
            gameStarted = true;
          }, 500);
          // console.log('Game restarted');
          createPreviewElement(); // Buat preview baru setelah restart
          requestAnimationFrame(gameLoop);
        } else {
          setTimeout(() => {
            gameStarted = true;
          }, 500);
        }
        // console.log('Game started');
      });
  };

  const gameOver = (finish = false) => {
    if (isGameOver) return;
    isGameOver = true;
    gameStarted = false;
    removePreviewElement(); // Hapus preview saat game over

    const dropcropsgrid = document.getElementById("dropcrops-container");
    const gameOverDiv = document.createElement("div");
    gameOverDiv.className = "game-over";
    gameOverDiv.style.display = "flex";
    if (finish) {
      const availablePlants = getAvailablePlants(lvpln).filter(
        (p) => p.emoji !== "🟫",
      );
      availablePlants.sort((a, b) => b.cost - a.cost);
      const reward = availablePlants[0].cost * 15;
      gameState.money += reward;
      if (gameState.pet.length > 0) {
        petHungerHandler(70);
        showNotification(
          `Got 🪙 ${reward} & Pet Hunger: ${Math.round(gameState.pet[0].hunger)}`,
        );
        updatePetUI();
      } else {
        showNotification(`Got 🪙 ${reward}`);
      }
      checkLevelUp();
      updateUI();
      saveGame();
      gameOverDiv.innerHTML = `
            <h2>Congratulations!</h2>
            <button class="restart-btn">OK</button>
        `;
    } else {
      gameOverDiv.innerHTML = `
            <h2>Game Over!</h2>
            <button class="restart-btn">OK</button>
        `;
    }
    // <p>Your score: ${score}</p>
    dropcropsgrid.appendChild(gameOverDiv);

    gameOverDiv
      .querySelector(".restart-btn")
      .addEventListener("click", function () {
        emojiBodies.forEach((data, body) => removeEmoji(body));
        emojiBodies.clear();
        dropcropsgrid.removeChild(gameOverDiv);
        score = 0;
        scoreElement.textContent = "0";
        _("#dropcrops-popup-overlay").classList.remove("show");
      });
  };

  const initDropCrop = () => {
    updateNextEmoji();
    createPreviewElement(); // Buat preview saat inisialisasi
    requestAnimationFrame(gameLoop);
    startGame();
  };

  const openDropCrops = async () => {
    const levelrequire = 10,
      maxlvl = 9;
    if (gameState.level >= levelrequire) {
      lvpln =
        gameState.level >= 25
          ? Math.floor(
              Math.random() * (Math.min(gameState.level, maxplant) - 10 + 1),
            ) + 10
          : gameState.level;
      const availablePlants = getAvailablePlants(lvpln).filter(
        (p) => p.emoji !== "🟫",
      );
      let newsort = [...availablePlants].map((p) => p.emoji);
      newsort.reverse();
      newsort = newsort.slice(0, Math.min(maxlvl, newsort.length));
      availablePlants.sort((a, b) => b.cost - a.cost);
      const entryCost = availablePlants[0].cost * 10;
      const confirmed = await showPopup(`Play Drop Crops for 🪙${entryCost}?`);
      if (confirmed) {
        newsort.reverse();

        _("#dropcrops-info").innerHTML = newsort
          .toString()
          .replace(/,/g, " > ");
        if (gameState.money >= entryCost) {
          if (gameState.money - entryCost >= 50) {
            EMOJI_SEQUENCE = newsort;
            gameState.money -= entryCost;
            updateUI();
            saveGame();
            initDropCrop();
            _("#dropcrops-popup-overlay").classList.add("show");
          } else {
            showNotification(`Can't play, not good for your 🪙 health`);
          }
        } else {
          showNotification(`Not enough 🪙<br>to play!`);
        }
      }
    } else {
      showPopup(
        `Drop Crops can be played at level ${levelrequire}`,
        "Level Requirement",
        false,
      );
    }
  };

  // Event listeners for dropcrops
  _("#play-dropcrops").addEventListener("click", openDropCrops);
  _("#dropcrops-close").addEventListener("click", async () => {
    const confirmed = await showPopup(
      `Close Drop Crops without finishing it will not return your 🪙.<br>Are you sure to close it?`,
    );
    if (confirmed) {
      emojiBodies.forEach((data, body) => removeEmoji(body));
      emojiBodies.clear();
      score = 0;
      scoreElement.textContent = "0";
      _("#dropcrops-popup-overlay").classList.remove("show");
    }
  });
  // ==========================================================================
  // ==========================================================================

  const mypets = document.querySelectorAll(".pet-emoji-container");

  mypets.forEach((mypet, index) => {
    let isDragging = false;
    let randomMovementInterval;
    const container = document.getElementById("container");

    // Target positions for roaming
    let targetX = Math.random() * (container.offsetWidth - 50);
    let targetY = Math.random() * (window.innerHeight - 50);

    // Live visual positions
    let currentX = targetX;
    let currentY = targetY;

    // Variabel untuk menyimpan posisi awal drag
    let startDragX, startDragY;
    let initialPetX, initialPetY;

    // Atur posisi awal
    mypet.style.left = currentX + "px";
    mypet.style.top = currentY + "px";

    // Fungsi untuk pergerakan acak
    function movemypetRandomly() {
      if (!isDragging) {
        const liveContainerWidth = container.offsetWidth || 800;
        const liveMaxY = window.innerHeight - 50;

        targetX = Math.floor(Math.random() * (liveContainerWidth - 50));
        targetY = Math.floor(Math.random() * liveMaxY);

        // Terapkan skala (flip) berdasarkan arah target
        if (targetX < currentX) {
          mypet.style.transform = "scale(1, 1)"; // Ke kiri
        } else {
          mypet.style.transform = "scale(-1, 1)"; // Ke kanan
        }
      }
    }

    // Mulai pergerakan acak dengan penundaan berbeda
    function startRandomMovement() {
      // Penundaan awal berbeda untuk setiap bola (0ms untuk bola 1, 2000ms untuk bola 2)
      const initialDelay = index * 2000;
      setTimeout(() => {
        movemypetRandomly();
        randomMovementInterval = setInterval(movemypetRandomly, 5000); // Interval 5 detik
      }, initialDelay);
    }

    // --- Animation Loop 60FPS (Lerping) ---
    function animate() {
      if (!isDragging) {
        // Smoothly move current position towards target
        // 0.01 factor at 60FPS is nice and slow
        currentX += (targetX - currentX) * 0.01;
        currentY += (targetY - currentY) * 0.01;

        mypet.style.left = currentX + "px";
        mypet.style.top = currentY + "px";
      }
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);

    // Hentikan pergerakan acak
    function stopRandomMovement() {
      clearInterval(randomMovementInterval);
    }

    // Event handler untuk mouse
    mypet.addEventListener("mousedown", (e) => {
      isDragging = true;
      stopRandomMovement();

      mypet.classList.add("dragging");

      startDragX = e.clientX;
      startDragY = e.clientY;
      initialPetX = currentX;
      initialPetY = currentY;

      e.preventDefault();
    });

    document.addEventListener("mousemove", (e) => {
      if (isDragging) {
        if (!mypet.classList.contains("dragging"))
          mypet.classList.add("dragging");

        const dx = e.clientX - startDragX;
        const dy = e.clientY - startDragY;

        currentX = initialPetX + dx;
        currentY = initialPetY + dy;

        // Clamping to container
        const liveContainerWidth = container.offsetWidth || 800;
        const maxX = liveContainerWidth - 50;
        const maxY = window.innerHeight - 50;
        currentX = Math.max(0, Math.min(maxX, currentX));
        currentY = Math.max(0, Math.min(maxY, currentY));

        mypet.style.left = currentX + "px";
        mypet.style.top = currentY + "px";
      }
    });

    document.addEventListener("mouseup", () => {
      if (isDragging) {
        isDragging = false;
        mypet.classList.remove("dragging");
        // Update target to current position to avoid snap-back
        targetX = currentX;
        targetY = currentY;
        startRandomMovement();
      }
    });

    // Event handler untuk touch
    mypet.addEventListener("touchstart", (e) => {
      isDragging = true;
      stopRandomMovement();

      mypet.classList.add("dragging");

      const touch = e.touches[0];
      startDragX = touch.clientX;
      startDragY = touch.clientY;
      initialPetX = currentX;
      initialPetY = currentY;

      e.preventDefault();
    });

    document.addEventListener("touchmove", (e) => {
      if (isDragging) {
        if (!mypet.classList.contains("dragging"))
          mypet.classList.add("dragging");
        const touch = e.touches[0];

        const dx = touch.clientX - startDragX;
        const dy = touch.clientY - startDragY;

        currentX = initialPetX + dx;
        currentY = initialPetY + dy;

        const liveContainerWidth = container.offsetWidth || 800;
        const maxX = liveContainerWidth - 50;
        const maxY = window.innerHeight - 50;
        currentX = Math.max(0, Math.min(maxX, currentX));
        currentY = Math.max(0, Math.min(maxY, currentY));

        mypet.style.left = currentX + "px";
        mypet.style.top = currentY + "px";
      }
    });

    document.addEventListener("touchend", () => {
      if (isDragging) {
        isDragging = false;
        mypet.classList.remove("dragging");
        targetX = currentX;
        targetY = currentY;
        startRandomMovement();
      }
    });

    // Memulai animasi untuk bola ini
    startRandomMovement();
  });

  // ======================================================================================
  // ================================== GARDEN GRID =======================================
  // ======================================================================================
  _("#garden").addEventListener("click", function () {
    _("#garden-container").style.display = "flex";
    _("#farm-button").style.display = "block";
    loadinventory();
  });
  const rows = 15; // Jumlah baris
  const cols = 11; // 11 kolom
  const gardenGrid = document.getElementById("gardenGrid");
  const inventoryGrid = document.getElementById("grid-inventory");
  const objectGrid = document.getElementById("grid-object");
  const marketGrid = document.getElementById("grid-market");
  let selectedEmoji = null;
  let draggedElement = null;
  let ghostElement = null;
  let touchTimeout = null;
  const gardenState = {
    checksum: null,
    inventory: {},
    garden: [],
  };
  const gardenItem = {
    "🪨": 10,
    "🪵": 10,
    "🚧": 10,
    "🌱": 10,
    "🌿": 10,
    "🌳": 10,
    "🌴": 10,
    "🌲": 10,
    "🎄": 10,
    "🌵": 10,
    "🪴": 10,
    "🪸": 10,
    "🎍": 10,
    "🍀": 10,
    "⚱️": 10,
    "🏺": 10,
    "🎈": 10,
    "🎏": 10,
    "🚪": 10,
    "🪟": 10,
    "💎": 10,
    "🎀": 10,
    "🏮": 10,
    "☁️": 10,
    "🗿": 10,
    "🌧️": 10,
    "🌨️": 10,
    "☀️": 10,
    "⭐": 10,
    "🌕": 10,
    "🌙": 10,
    "🌫️": 10,
    "❄️": 10,
    "🫧": 10,
    "⚡": 10,
    "🔥": 10,
    "🌈": 10,
    "🕸️": 10,
    "⛄": 10,
    "🎁": 10,
    "🕯️": 10,
    "📺": 10,
    "📻": 10,
    "📡": 10,
    "🪜": 10,
    "🧱": 10,
    "🪑": 10,
    "🛋️": 10,
    "🛝": 10,
    "🥅": 10,
    "🗑️": 10,
    "💰": 10,
    "🕰️": 10,
    "⏰": 10,
    "⚽": 10,
    "🏀": 10,
    "🏐": 10,
    "🏈": 10,
    "♟️": 10,
    "🎰": 10,
    "🐚": 10,
    "🎵": 10,
    "🎶": 10,
    "🎐": 10,
    "🪩": 10,
    "🎎": 10,
    "🪅": 10,
    "📫": 10,
    "📮": 10,
    "🪞": 10,
    "⛲": 10,
    "🪦": 10,
    "💈": 10,
    "🪺": 10,
    "⛩️": 10,
    "🕋": 10,
    "🛕": 10,
    "🕍": 10,
    "🕌": 10,
    "⛪": 10,
    "🏛️": 10,
    "💒": 10,
    "🏩": 10,
    "🏫": 10,
    "🏪": 10,
    "🏨": 10,
    "🏦": 10,
    "🏥": 10,
    "🏤": 10,
    "🏣": 10,
    "🏬": 10,
    "🏢": 10,
    "🏭": 10,
    "🏗️": 10,
    "🏚️": 10,
    "🏡": 10,
    "🏠": 10,
    "🛖": 10,
    "⛺": 10,
    "🗻": 10,
    "🏔️": 10,
    "⛰️": 10,
    "🌋": 10,
    "🎡": 10,
    "🏯": 10,
    "🏰": 10,
    "🚋": 10,
    "🚃": 10,
    "🚟": 10,
    "🛺": 10,
    "🏍️": 10,
    "🛵": 10,
    "🚲": 10,
    "🛴": 10,
    "🚜": 10,
    "🚛": 10,
    "🚚": 10,
    "🛻": 10,
    "🚐": 10,
    "🚒": 10,
    "🚑": 10,
    "🚓": 10,
    "🏎️": 10,
    "🚎": 10,
    "🚌": 10,
    "🚙": 10,
    "🚕": 10,
    "🚗": 10,
    "⛽": 10,
    "🚁": 10,
    "🛸": 10,
    "🕳️": 10,
    "🩷": 10,
    "❤️": 10,
    "🧡": 10,
    "💛": 10,
    "💚": 10,
    "🩵": 10,
    "💙": 10,
    "💜": 10,
    "🖤": 10,
    "🩶": 10,
    "🤍": 10,
    "🤎": 10,
    "🟥": 10,
    "🟧": 10,
    "🟨": 10,
    "🟩": 10,
    "🟦": 10,
    "🟪": 10,
    "⬛": 10,
    "⬜": 10,
    "🟫": 10,
    "🏳️": 10,
    "🏴": 10,
    "🚩": 10,
    "🏁": 10,
    "🔰": 10,
    "♻️": 10,
    "⚠️": 10,
    "🚸": 10,
    "❌": 10,
    "✖️": 10,
    "🟰": 10,
    "➕": 10,
    "➖": 10,
    "❗": 10,
    "❕": 10,
    "💠": 10,
    "🆗": 10,
    "🆓": 10,
    "🆙": 10,
    "🆒": 10,
    "🆕": 10,
    "0️⃣": 10,
    "1️⃣": 10,
    "2️⃣": 10,
    "3️⃣": 10,
    "4️⃣": 10,
    "5️⃣": 10,
    "6️⃣": 10,
    "7️⃣": 10,
    "8️⃣": 10,
    "9️⃣": 10,
    "🔟": 10,
    "➡️": 10,
    "⬅️": 10,
    "⬆️": 10,
    "⬇️": 10,
    "↗️": 10,
    "↘️": 10,
    "↙️": 10,
    "↖️": 10,
    "↪️": 10,
    "↩️": 10,
    "⤴️": 10,
    "⤵️": 10,
  };

  const initgarden = () => {
    // Buat grid
    for (let i = 0; i < rows * cols; i++) {
      const cell = document.createElement("div");
      cell.classList.add("grid-cell");
      cell.setAttribute("draggable", "true");
      cell.addEventListener("dragover", (e) => e.preventDefault());
      cell.addEventListener("dragenter", () =>
        cell.classList.add("dragging-over"),
      );
      cell.addEventListener("dragleave", () =>
        cell.classList.remove("dragging-over"),
      );
      cell.addEventListener("drop", (e) => dropItem(e, cell));
      cell.addEventListener("dragstart", handleGridDragStart);
      cell.addEventListener("dragend", handleGridDragEnd);
      cell.addEventListener("touchstart", (e) => handleGridTouchStart(e, cell));
      cell.addEventListener("touchmove", (e) => handleGridTouchMove(e, cell));
      cell.addEventListener("touchend", (e) => handleGridTouchEnd(e, cell));
      cell.addEventListener("click", (e) => {
        addEmojiToGrid(cell);
      });
      gardenGrid.appendChild(cell);
    }

    loadGridState();
    loadinventory();
    gardenMarketTabs();
  };

  _("#farm-button").addEventListener("click", function () {
    _("#garden-container").style.display = "none";
    _("#livestock-container").style.display = "none";
    _("#farm-button").style.display = "none";
    _("#kitchen-container").style.display = "none";
    clearSelectedEmoji();
  });

  _("#closegardeninventory").addEventListener("click", function () {
    toggleGardenInventory();
  });

  _("#garden-button").addEventListener("click", function () {
    toggleGardenInventory();
  });

  _("#copy-button").addEventListener("click", function () {
    copyGrid();
  });

  _("#clearselected").addEventListener("click", function () {
    clearSelectedEmoji();
  });

  _("#sellselected").addEventListener("click", function () {
    if (gardenState.inventory[selectedEmoji.emoji] != undefined) {
      const emoji = selectedEmoji.emoji;
      const cost = gardenItem[emoji];
      const count = gardenState.inventory[emoji];
      showPopup(`
                Sell ${emoji} for 🪙${cost} each?<br>
                <button type="button" id="qtysellmin" style="position:relative;top:2px;padding:5px;background:#ffffff;color:#000000;">➖</button>
                <input type="number" id="sell-quantity" min="1" max="${count}" value="${count}" style="width:100px;margin:10px;padding:5px 8px;border-radius: 5px;border:2px solid #2E8B57;text-align:right;outline:none;">
                <button type="button" id="qtyselladd" style="position:relative;top:2px;padding:5px;background:#ffffff;color:#000000;">➕</button>
                <div>Total: 🪙<span id="sell-total">${count * cost}</span></div>
            `).then((confirmed) => {
        if (confirmed) {
          const quantityInput = _("#sell-quantity");
          const quantity = parseInt(quantityInput.value);
          if (quantity > 0 && quantity <= count) {
            const sell = quantity * cost || 0;
            gameState.money += sell;
            gameState.money =
              gameState.money > maxmoney ? maxmoney : gameState.money;
            gardenState.inventory[emoji] -= quantity;
            if (gardenState.inventory[emoji] <= 0) {
              delete gardenState.inventory[emoji];
            }
            updateUI();
            saveGame();
            loadinventory();
            saveGridState();
            showNotification(`Sold ${quantity} ${emoji} for 🪙${sell}!`);
          }
        }
      });

      _("#sell-quantity").addEventListener("input", (e) => {
        let quantity = parseInt(e.target.value);
        if (quantity < 1) {
          quantity = 1;
        }
        if (quantity > count) {
          quantity = count;
        }
        if (isNaN(quantity)) {
          quantity = 0;
        } else {
          e.target.value = quantity;
        }
        _("#sell-total").textContent = quantity * cost;
      });

      _("#qtysellmin").addEventListener("click", () => {
        let qty = parseInt(_("#sell-quantity").value) - 1;
        if (qty < 1) {
          qty = 1;
          _("#sell-quantity").value = 1;
        } else {
          _("#sell-quantity").value = qty;
        }
        _("#sell-total").textContent = qty * cost;
      });

      _("#qtyselladd").addEventListener("click", () => {
        let qty = parseInt(_("#sell-quantity").value) + 1;
        if (qty > count) {
          qty = count;
          _("#sell-quantity").value = count;
        } else {
          _("#sell-quantity").value = qty;
        }
        _("#sell-total").textContent = qty * cost;
      });
    }
  });

  const toggleGardenInventory = () => {
    if (_("#wrapgrid-inventory").style.transform == "translate(-50%, -45px)") {
      _("#wrapgrid-inventory").style.transform = "translate(-50%, 220px)";
    } else {
      _("#wrapgrid-inventory").style.transform = "translate(-50%, -45px)";
    }
  };

  const clearSelectedEmoji = () => {
    selectedEmoji = null;
    document
      .querySelectorAll(".inventorygrid-item")
      .forEach((i) => i.classList.remove("itemselected"));
    _("#clearselected").style.display = "none";
    _("#sellselected").style.display = "none";
  };

  const initinventorygrid = () => {
    // Inisialisasi item inventaris
    document.querySelectorAll(".inventorygrid-item").forEach((item) => {
      item.addEventListener("click", () => {
        let activetab = "";
        document.querySelectorAll(".market-garden").forEach((tab) => {
          if (tab.classList.length == 2) {
            activetab = tab.dataset.tab;
          }
        });

        let cost = 0;
        if (activetab == "market") {
          cost =
            gardenItem[item.dataset.item] != undefined
              ? gardenItem[item.dataset.item]
              : 0;
        }
        selectedEmoji = { emoji: item.dataset.item, cost: cost };

        document
          .querySelectorAll(".inventorygrid-item")
          .forEach((i) => i.classList.remove("itemselected"));
        item.classList.add("itemselected");
        _("#clearselected").style.display = "block";
        if (activetab == "object") {
          _("#sellselected").style.display = "block";
        }
      });
    });
  };

  const loadinventory = () => {
    inventoryGrid.innerHTML = "";
    Object.entries(gameState.inventory).forEach(([emoji, count]) => {
      if (count > 0) {
        const item = document.createElement("div");
        item.className = "inventorygrid-item";
        // item.setAttribute("draggable", "true");
        item.setAttribute("data-item", emoji);
        item.innerHTML = `${emoji}<br><span style="font-size:15px;">${count}</span>`;
        inventoryGrid.appendChild(item);
      }
    });

    // Inisialisasi item inventaris
    // document.querySelectorAll('.inventorygrid-item').forEach(item => {
    // item.addEventListener('dragstart', handleGridDragStart);
    // item.addEventListener('dragend', handleGridDragEnd);
    // item.addEventListener('touchstart', (e) => handleGridTouchStart(e, item));
    // item.addEventListener('touchmove', (e) => handleGridTouchMove(e, item));
    // item.addEventListener('touchend', (e) => handleGridTouchEnd(e, item));
    // });

    objectGrid.innerHTML = "";
    Object.entries(gardenState.inventory).forEach(([emoji, count]) => {
      if (count > 0) {
        const item = document.createElement("div");
        item.className = "inventorygrid-item";
        // item.setAttribute("draggable", "true");
        item.setAttribute("data-item", emoji);
        item.innerHTML = `${emoji}<br><span style="font-size:15px;">${count}</span>`;
        objectGrid.appendChild(item);
      }
    });

    marketGrid.innerHTML = "";
    Object.entries(gardenItem).forEach(([emoji, count]) => {
      if (count > 0) {
        const item = document.createElement("div");
        item.className = "inventorygrid-item";
        // item.setAttribute("draggable", "true");
        item.setAttribute("data-item", emoji);
        item.innerHTML = `${emoji}<br><span style="font-size:15px;">🪙${count}</span>`;
        marketGrid.appendChild(item);
      }
    });

    initinventorygrid();
  };

  const gardenMarketTabs = () => {
    document.querySelectorAll(".market-garden").forEach((tab) => {
      tab.addEventListener("click", () => {
        // Hapus class active dari semua tab
        document
          .querySelectorAll(".market-garden")
          .forEach((t) => t.classList.remove("active"));
        // Tambahkan class active ke tab yang diklik
        tab.classList.add("active");
        // Tampilkan konten yang sesuai
        const tabType = tab.dataset.tab;
        _("#grid-inventory").style.display =
          tabType === "inventory" ? "grid" : "none";
        _("#grid-object").style.display =
          tabType === "object" ? "grid" : "none";
        _("#grid-market").style.display =
          tabType === "market" ? "grid" : "none";
        clearSelectedEmoji();
      });
    });
  };

  const addEmojiToGrid = (element) => {
    // kalau inventory kurangi
    // console.log(selectedEmoji);
    if (selectedEmoji != null) {
      const emoji = selectedEmoji.emoji;
      const cost = selectedEmoji.cost;
      if (gameState.inventory[emoji] != undefined) {
        if (gameState.inventory[emoji] > 0) {
          if (element.textContent == "") {
            element.textContent = emoji;
            element.setAttribute("data-item", emoji);
            gameState.inventory[emoji]--;
            if (gameState.inventory[emoji] == 0) {
              clearSelectedEmoji();
            }
            saveGame();
            updateUI();
            loadinventory();
          }
        } else {
          clearSelectedEmoji();
          if (emoji != null) {
            showNotification(`Not enough ${emoji} in inventory!`);
          }
        }
      } else {
        // get from object
        if (cost == 0) {
          if (gardenState.inventory[emoji] != undefined) {
            if (gardenState.inventory[emoji] > 0 && element.textContent == "") {
              element.textContent = emoji;
              element.setAttribute("data-item", emoji);
              gardenState.inventory[emoji]--;
              if (gardenState.inventory[emoji] == 0) {
                clearSelectedEmoji();
              }
              loadinventory();
            }
          } else {
            clearSelectedEmoji();
            if (emoji != null) {
              showNotification(`Not enough ${emoji} in inventory!`);
            }
          }
        } else {
          if (gardenItem[emoji] != undefined) {
            if (gameState.money - parseInt(cost) >= 50) {
              if (element.textContent == "") {
                gameState.money -= parseInt(cost);
                element.textContent = emoji;
                element.setAttribute("data-item", emoji);
                loadinventory();
                updateUI();
              }
            } else {
              clearSelectedEmoji();
              showNotification(`can't buy, not good for your 🪙 health`);
            }
          } else {
            clearSelectedEmoji();
          }
        }
      }
      saveGridState();
    }
  };

  const returnEmojiFromGrid = (emoji) => {
    // kalau inventory kembalikan ke inventory
    const plant = plantTypes.find((p) => p.emoji === emoji);
    if (plant != undefined) {
      if (!gameState.inventory[emoji]) {
        gameState.inventory[emoji] = 0;
      }
      gameState.inventory[emoji]++;
      saveGame();
      updateUI();
      loadinventory();
    } else {
      // kalau garden item kembalikan ke garden inventory
      if (!gardenState.inventory[emoji]) {
        gardenState.inventory[emoji] = 0;
      }
      gardenState.inventory[emoji]++;
      loadinventory();
    }
    saveGridState();
  };

  // Fungsi untuk menangani drag start
  const handleGridDragStart = (e) => {
    draggedElement =
      e.target.closest(".grid-cell") || e.target.closest(".inventorygrid-item");
    if (draggedElement) {
      const item = draggedElement.dataset.item || draggedElement.textContent;
      if (item) {
        e.dataTransfer.setData("text/plain", item);
        if (draggedElement.classList.contains("grid-cell")) {
          e.dataTransfer.setData("remove", "true");
        }
        draggedElement.classList.add("dragging");

        // Buat elemen ghost
        ghostElement = document.createElement("div");
        ghostElement.classList.add("drag-ghost");
        ghostElement.textContent = item;
        ghostElement.style.top = "-300px";
        document.body.appendChild(ghostElement);

        // Nonaktifkan drag image bawaan browser
        const emptyImage = new Image();
        emptyImage.src =
          "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAACwAAAAAAQABAAACAkQBADs";
        e.dataTransfer.setDragImage(emptyImage, 0, 0);
        selectedEmoji = null;
      } else {
        e.preventDefault();
      }
    }
  };

  // Fungsi untuk menangani drag end
  const handleGridDragEnd = () => {
    if (draggedElement) {
      draggedElement.classList.remove("dragging");
      draggedElement = null;
    }
    if (ghostElement) {
      ghostElement.remove();
      ghostElement = null;
    }
    document
      .querySelectorAll(".grid-cell")
      .forEach((cell) => cell.classList.remove("dragging-over"));
  };

  // Fungsi untuk menangani drop
  const dropItem = (e, cell) => {
    e.preventDefault();
    const item = e.dataTransfer.getData("text/plain");
    const isRemove = e.dataTransfer.getData("remove") === "true";
    cell.classList.remove("dragging-over");

    if (isRemove && draggedElement !== cell) {
      if (draggedElement.textContent != "") {
        draggedElement.textContent = cell.textContent;
        draggedElement.removeAttribute("data-item");
      } else {
        draggedElement.textContent = "";
      }
      cell.textContent = item;
    } else if (item) {
      cell.textContent = item;
    }
    saveGridState();
    handleGridDragEnd();
  };

  // Fungsi untuk touch event
  const handleGridTouchStart = (e, element) => {
    e.preventDefault();
    if (element.textContent != "") {
      draggedElement = element;
      if (element.classList.contains("grid-cell") && element.textContent) {
        element.dataset.item = element.textContent;
        element.dataset.remove = "true";
      }
      touchTimeout = setTimeout(() => {
        ghostElement = document.createElement("div");
        ghostElement.classList.add("drag-ghost");
        ghostElement.style.display = "none";
        ghostElement.textContent = element.dataset.item || element.textContent;
        document.body.appendChild(ghostElement);
      }, 100);
    }
    if (selectedEmoji != null) {
      addEmojiToGrid(element);
    }
  };

  const handleGridTouchMove = (e, element) => {
    e.preventDefault();
    if (draggedElement && ghostElement) {
      element.classList.add("dragging");
      const touch = e.touches[0];
      const offset = window.innerWidth <= 600 ? 14 : 30; // Offset disesuaikan untuk mobile
      ghostElement.style.display = "block";
      ghostElement.style.left = `${touch.clientX - offset}px`;
      ghostElement.style.top = `${touch.clientY - offset + window.scrollY}px`; // Kompensasi scroll

      const target = document.elementFromPoint(touch.clientX, touch.clientY);
      document
        .querySelectorAll(".grid-cell")
        .forEach((cell) => cell.classList.remove("dragging-over"));
      if (target && target.classList.contains("grid-cell")) {
        target.classList.add("dragging-over");
      }
    }
  };

  const handleGridTouchEnd = (e, element) => {
    e.preventDefault();
    clearTimeout(touchTimeout);
    if (draggedElement && ghostElement) {
      ghostElement.remove();
      ghostElement = null;
      draggedElement.classList.remove("dragging");

      const touch = e.changedTouches[0];
      const target = document.elementFromPoint(touch.clientX, touch.clientY);

      if (target && target.classList.contains("grid-cell")) {
        const item = draggedElement.dataset.item || draggedElement.textContent;
        const isRemove = draggedElement.dataset.remove === "true";

        if (isRemove && draggedElement !== target) {
          if (target.textContent != "") {
            draggedElement.textContent = target.textContent;
            draggedElement.removeAttribute("data-item");
          } else {
            draggedElement.textContent = "";
          }
          target.textContent = item;
        } else if (item) {
          target.textContent = item;
        }
      } else if (
        draggedElement.classList.contains("grid-cell") &&
        draggedElement.textContent
      ) {
        // kembalikan inventory
        returnEmojiFromGrid(draggedElement.textContent);
        draggedElement.setAttribute("data-item", "");
        draggedElement.textContent = ""; // Hapus jika diseret ke luar
      }

      saveGridState(); // Simpan status grid setelah perubahan
      document
        .querySelectorAll(".grid-cell")
        .forEach((cell) => cell.classList.remove("dragging-over"));
      draggedElement = null;
    }
  };

  // Menghapus item jika diseret keluar grid (desktop)
  document.addEventListener("dragover", (e) => e.preventDefault());
  document.addEventListener("drop", (e) => {
    if (
      !e.target.closest(".grid-cell") &&
      !e.target.closest(".inventorygrid-item") &&
      draggedElement
    ) {
      const isRemove = e.dataTransfer.getData("remove") === "true";
      if (isRemove && draggedElement.textContent) {
        // kembalikan inventory
        returnEmojiFromGrid(draggedElement.textContent);
        draggedElement.setAttribute("data-item", "");
        draggedElement.textContent = "";
        saveGridState(); // Simpan status grid setelah penghapusan
      }
      handleGridDragEnd();
    }
  });

  // Update posisi ghost element saat drag di desktop
  document.addEventListener("drag", (e) => {
    if (ghostElement && e.clientX && e.clientY) {
      ghostElement.style.left = `${e.clientX - 30}px`; // Offset setengah ukuran elemen
      ghostElement.style.top = `${e.clientY - 30 + window.scrollY}px`; // Kompensasi scroll
    }
  });

  // Fungsi untuk menyalin grid ke clipboard sebagai teks
  const copyGrid = () => {
    const cells = document.querySelectorAll(".grid-cell");
    let gridText = "";
    for (let row = 0; row < rows; row++) {
      let rowText = "";
      for (let col = 0; col < cols; col++) {
        const cellIndex = row * cols + col;
        const cellContent = cells[cellIndex].textContent || "▫️";
        rowText += `${cellContent}`;
      }
      gridText += rowText + "\n";
    }

    // Salin ke clipboard
    navigator.clipboard
      .writeText(gridText)
      .then(() => {
        showNotification("Copied");
      })
      .catch((err) => {
        console.error("Failed to copy to clipboard: ", err);
        showNotification("Failed to copy to clipboard");
      });
  };

  const gardenChecksum = (data) => {
    const str = JSON.stringify({
      garden: data.garden,
      inventory: data.inventory,
    });
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
    }
    return hash;
  };

  // Fungsi untuk menyimpan status grid ke localStorage
  const saveGridState = () => {
    const cells = document.querySelectorAll(".grid-cell");
    const gridState = Array.from(cells).map((cell) => cell.textContent || "");
    gardenState["garden"] = gridState;
    gardenState.checksum = gardenChecksum(gardenState);
    localStorage.setItem("gardenGrid", JSON.stringify(gardenState));
  };

  // Fungsi untuk memuat status grid dari localStorage
  const loadGridState = () => {
    const savedState = localStorage.getItem("gardenGrid");
    if (savedState) {
      const parsed = JSON.parse(savedState);

      if (gardenChecksum(parsed) !== parsed["checksum"]) {
        console.error("Checksum mismatch, loading default state.");
        return;
      }

      if (!parsed.hasOwnProperty("garden")) {
        parsed["garden"] = parsed;
      }

      if (!parsed.hasOwnProperty("inventory")) {
        parsed["inventory"] = {};
      }

      Object.assign(gardenState, parsed);

      const gridState = parsed["garden"];
      const cells = document.querySelectorAll(".grid-cell");
      cells.forEach((cell, index) => {
        if (gridState[index]) {
          cell.textContent = gridState[index];
        }
      });
    } else {
      const cells = document.querySelectorAll(".grid-cell");
      cells.forEach((cell, index) => {
        if (gardenState.garden.length == 0) {
          if (index == 82) {
            cell.textContent = "⛲";
          }
        }
      });
    }
  };
  // ======================================================================================
  // ================================= GARDEN GRID ========================================
  // ======================================================================================

  // ======================================================================================
  // ============================== INVENTORY TRANSFER ====================================
  // ======================================================================================

  let peer = null;
  let transferConn = null;
  let selectedTransferItem = null;
  let qrcode = null;
  let html5QrCode = null;

  const initTransfer = () => {
    _("#inventory-transfer-btn").addEventListener("click", openTransferPopup);
    _("#transfer-close").addEventListener("click", closeTransferPopup);
    _("#transfer-send-mode").addEventListener("click", showSendForm);
    _("#transfer-receive-mode").addEventListener("click", showReceiveForm);
    _("#transfer-gen-code").addEventListener("click", startTransferHost);
    _("#transfer-connect-btn").addEventListener("click", connectToHost);
    _("#transfer-scan-btn").addEventListener("click", toggleQRScanner);

    _("#transfer-qty-min").addEventListener("click", () => {
      let qty = parseInt(_("#transfer-qty").value) - 1;
      _("#transfer-qty").value = Math.max(1, qty);
    });

    _("#transfer-qty-plus").addEventListener("click", () => {
      let qty = parseInt(_("#transfer-qty").value) + 1;
      const maxCount = gameState.inventory[selectedTransferItem] || 0;
      _("#transfer-qty").value = Math.min(maxCount, qty);
    });
  };

  const openTransferPopup = () => {
    _("#transfer-input-code").value = "";
    _("#transfer-popup-overlay").classList.add("show");
    resetTransferUI();
  };

  const closeTransferPopup = () => {
    _("#transfer-qty-section").style.display = "none";
    _("#transfer-popup-overlay").classList.remove("show");
    if (peer) {
      peer.destroy();
      peer = null;
    }
    transferConn = null;
    stopQRScanner();
  };

  const resetTransferUI = () => {
    _("#transfer-setup").style.display = "block";
    _("#transfer-send-form").style.display = "none";
    _("#transfer-receive-form").style.display = "none";
    _("#transfer-qrcode-container").style.display = "none";
    _("#transfer-status").textContent = "";
    _("#transfer-id-display").textContent = "----";
    if (_("#transfer-qrcode")) _("#transfer-qrcode").innerHTML = "";
    selectedTransferItem = null;
    stopQRScanner();
  };

  const showSendForm = () => {
    _("#transfer-setup").style.display = "none";
    _("#transfer-send-form").style.display = "block";
    populateTransferItems();
  };

  const showReceiveForm = () => {
    _("#transfer-setup").style.display = "none";
    _("#transfer-receive-form").style.display = "block";
  };

  const populateTransferItems = () => {
    const list = _("#transfer-items-list");
    list.innerHTML = "";
    Object.entries(gameState.inventory).forEach(([emoji, count]) => {
      if (count > 0) {
        const item = document.createElement("div");
        item.className = "market-item";
        item.innerHTML = `
          <div class="market-item-emoji">${emoji}</div>
          <div class="market-item-count">${count}</div>
        `;
        item.addEventListener("click", () => {
          document
            .querySelectorAll("#transfer-items-list .market-item")
            .forEach((el) => el.classList.remove("selected"));
          item.classList.add("selected");
          selectedTransferItem = emoji;
          _("#transfer-qty-section").style.display = "block";
          _("#transfer-item-selected").textContent = emoji;
          _("#transfer-qty").value = 1;
          _("#transfer-qty").max = count;
          _("#transfer-qty").addEventListener("input", () => {
            if (parseInt(_("#transfer-qty").value) > count) {
              _("#transfer-qty").value = count;
            }
            if (parseInt(_("#transfer-qty").value) < 1) {
              _("#transfer-qty").value = 1;
            }
          });
        });
        list.appendChild(item);
      }
    });

    if (list.innerHTML === "") {
      list.innerHTML = "<p>Inventory is empty</p>";
    }
  };

  const startTransferHost = () => {
    const qty = parseInt(_("#transfer-qty").value);
    if (!selectedTransferItem || qty <= 0) {
      showNotification("Please select an item and quantity");
      return;
    }

    _("#transfer-send-form").style.display = "none";
    _("#transfer-status").textContent = "Initializing Peer...";

    // Generate random short ID for easier typing
    const shortId =
      "EF-" + Math.random().toString(36).substring(2, 8).toUpperCase();

    peer = new Peer(shortId);

    peer.on("open", (id) => {
      _("#transfer-id-display").textContent = id;
      _("#transfer-qrcode-container").style.display = "block";
      _("#transfer-status").textContent = "Share this code with receiver";

      // Generate QR Code
      if (_("#transfer-qrcode")) {
        _("#transfer-qrcode").innerHTML = "";
        new QRCode(_("#transfer-qrcode"), {
          text: id,
          width: 128,
          height: 128,
        });
      }
    });

    peer.on("connection", (conn) => {
      transferConn = conn;
      _("#transfer-status").textContent = "Connected! Sending item...";

      conn.on("open", () => {
        const data = {
          type: "TRANSFER_ITEM",
          emoji: selectedTransferItem,
          quantity: qty,
        };
        conn.send(data);

        // Success handler
        setTimeout(() => {
          gameState.inventory[selectedTransferItem] -= qty;
          if (gameState.inventory[selectedTransferItem] <= 0) {
            delete gameState.inventory[selectedTransferItem];
          }
          updateUI();
          saveGame();
          showNotification(`Transferred ${qty} ${selectedTransferItem}!`);
          closeTransferPopup();
        }, 1000);
      });

      conn.on("error", (err) => {
        _("#transfer-status").textContent = "Error: " + err;
      });
    });

    peer.on("error", (err) => {
      _("#transfer-status").textContent = "Connection Error";
      console.error(err);
    });
  };

  const connectToHost = () => {
    const code = _("#transfer-input-code").value.trim().toUpperCase();
    if (!code) {
      showNotification("Please enter a code");
      return;
    }

    _("#transfer-status").textContent = "Connecting...";

    // Receiver uses random ID
    peer = new Peer();

    peer.on("open", () => {
      const conn = peer.connect(code);
      transferConn = conn;

      conn.on("open", () => {
        _("#transfer-status").textContent = "Connected! Waiting for data...";
      });

      conn.on("data", (data) => {
        if (data.type === "TRANSFER_ITEM") {
          const { emoji, quantity } = data;

          if (!gameState.inventory[emoji]) {
            gameState.inventory[emoji] = 0;
          }
          gameState.inventory[emoji] += quantity;

          updateUI();
          saveGame();

          _("#transfer-status").textContent = `Received ${quantity} ${emoji}!`;
          showNotification(`Received ${quantity} ${emoji}!`);

          setTimeout(() => {
            closeTransferPopup();
          }, 2000);
        }
      });

      conn.on("error", (err) => {
        _("#transfer-status").textContent = "Connection failed";
      });
    });

    peer.on("error", (err) => {
      _("#transfer-status").textContent = "Peer JS Error";
      console.error(err);
    });
  };

  const toggleQRScanner = () => {
    if (html5QrCode && html5QrCode.isScanning) {
      stopQRScanner();
    } else {
      startQRScanner();
    }
  };

  const startQRScanner = () => {
    _("#transfer-reader").style.display = "block";
    _("#transfer-status").textContent = "Opening camera...";
    _("#transfer-scan-btn").textContent = "🛑 Stop Scanning";

    html5QrCode = new Html5Qrcode("transfer-reader");
    const config = { fps: 10, qrbox: { width: 250, height: 250 } };

    html5QrCode
      .start(
        { facingMode: "environment" },
        config,
        (decodedText) => {
          // success
          _("#transfer-input-code").value = decodedText;
          _("#transfer-status").textContent = "Code scanned!";
          showNotification("Code scanned successfully!");
          stopQRScanner();
          connectToHost(); // Auto connect after scan
        },
        (errorMessage) => {
          // parse error, ignore it
        },
      )
      .catch((err) => {
        _("#transfer-status").textContent = "Camera error: " + err;
        _("#transfer-reader").style.display = "none";
        _("#transfer-scan-btn").textContent = "📷 Scan QR Code";
      });
  };

  const initKitchen = () => {
    _("#kitchen-button").addEventListener("click", openKitchenPage);
  };

  const openKitchenPage = () => {
    _("#kitchen-container").style.display = "flex";
    _("#farm-button").style.display = "block";
    populateRecipes();
    updateKitchenQuestsUI();
    updateKitchenStations();
  };

  const populateRecipes = () => {
    const recipeContainer = _("#kitchen-recipes");
    recipeContainer.innerHTML = "";

    recipes.forEach((recipe) => {
      const card = document.createElement("div");
      card.className = "recipe-card";

      const isUnlocked = gameState.kitchen.unlockedRecipes.includes(recipe.id);

      if (!isUnlocked) {
        card.innerHTML = `
          <div class="recipe-emoji">${recipe.emoji}</div>
          <div class="recipe-name">${recipe.name}</div>
          <div class="recipe-ingredients" style="color:#e67e22; font-weight:bold;">Cost: 🪙${recipe.cost}</div>
          <button class="recipe-button buy">
            📜 Buy
          </button>
        `;
        card.querySelector(".recipe-button").addEventListener("click", () => {
          buyRecipe(recipe.id);
        });
      } else {
        let ingredientStatus = true;
        let ingredientText = [];
        for (const [emoji, qty] of Object.entries(recipe.ingredients)) {
          const has = gameState.inventory[emoji] || 0;
          ingredientText.push(`${emoji}${qty}`);
          if (has < qty) ingredientStatus = false;
        }

        card.innerHTML = `
          <div class="recipe-emoji">${recipe.emoji}</div>
          <div class="recipe-name">${recipe.name}</div>
          <div class="recipe-ingredients">${ingredientText.join(" + ")}</div>
          <button class="recipe-button ${ingredientStatus ? "" : "disabled"}">
            ${ingredientStatus ? "🥘 Cook" : "❌"}
          </button>
        `;

        if (ingredientStatus) {
          card.querySelector(".recipe-button").addEventListener("click", () => {
            startCooking(recipe.id);
          });
        }
      }

      recipeContainer.appendChild(card);
    });
  };

  const startCooking = (recipeId) => {
    // Find empty station among unlocked ones
    const emptyIndex = gameState.kitchen.stations.findIndex(
      (s, i) => s === null && i < gameState.kitchen.unlockedCount,
    );
    if (emptyIndex === -1) {
      if (gameState.kitchen.unlockedCount === 0) {
        showNotification("Unlock a stove first!");
      } else {
        showNotification("All unlocked stoves are busy!");
      }
      return;
    }

    const recipe = recipes.find((r) => r.id === recipeId);
    if (!recipe) return;

    // Check ingredients again
    for (const [emoji, qty] of Object.entries(recipe.ingredients)) {
      if ((gameState.inventory[emoji] || 0) < qty) {
        showNotification(`Not enough ingredients for ${recipe.name}!`);
        return;
      }
    }

    playSound("cook.wav");
    // Consume ingredients
    for (const [emoji, qty] of Object.entries(recipe.ingredients)) {
      gameState.inventory[emoji] -= qty;
      if (gameState.inventory[emoji] <= 0) delete gameState.inventory[emoji];
    }

    gameState.kitchen.stations[emptyIndex] = {
      recipeId: recipeId,
      startTime: Date.now(),
      duration: recipe.time * 1000, // to ms
      completed: false,
    };

    updateUI();
    populateRecipes(); // Update button states (insufficient ingredients after use)
    updateKitchenStations();
    saveGame();
  };

  const updateKitchenStations = () => {
    const list = _("#kitchen-stations");

    // Initialize exactly 6 divs if not already there
    if (list.children.length !== 6) {
      list.innerHTML = "";
      for (let i = 0; i < 6; i++) {
        const div = document.createElement("div");
        div.id = `station-${i}`;
        div.className = "kitchen-station idle";

        div.addEventListener("click", () => {
          const station = gameState.kitchen.stations[i];
          if (station) {
            const elapsed = Date.now() - station.startTime;
            const isReady = elapsed >= station.duration;
            if (isReady) {
              finishCooking(i);
            }
          }
        });

        list.appendChild(div);
      }
    }

    gameState.kitchen.stations.forEach((station, index) => {
      const stationDiv = _(`#station-${index}`);

      // If stove is locked
      if (index >= gameState.kitchen.unlockedCount) {
        const stoveCost = (index + 1) * 500; // 500, 1000, 1500, 2000

        if (stationDiv.className !== "kitchen-station locked") {
          stationDiv.className = "kitchen-station locked";
          stationDiv.innerHTML = `<div class="station-locked-icon">🔒</div>`;

          // Only show Buy button if it's the NEXT stove in sequence
          if (index === gameState.kitchen.unlockedCount) {
            stationDiv.innerHTML += `
              <button class="recipe-button buy" style="font-size: 0.7rem !important; padding: 5px;">
                Buy Stove<br>🪙${stoveCost}
              </button>
            `;
            stationDiv
              .querySelector("button")
              .addEventListener("click", (e) => {
                e.stopPropagation();
                buyStove(index, stoveCost);
              });
          }
        }
        return;
      }

      if (station === null) {
        if (stationDiv.className !== "kitchen-station idle") {
          stationDiv.className = "kitchen-station idle";
          stationDiv.innerHTML = "";
        }
        return;
      }

      const recipe = recipes.find((r) => r.id === station.recipeId);
      const elapsed = Date.now() - station.startTime;
      const progress = Math.min((elapsed / station.duration) * 100, 100);
      const isReady = progress >= 100;

      const newClass = `kitchen-station ${isReady ? "ready" : "cooking"}`;
      if (stationDiv.className !== newClass) stationDiv.className = newClass;

      let innerHTML = `<div class="station-emoji wave-animation">${recipe.emoji}</div>`;

      if (isReady) {
        innerHTML += `<div class="station-ready-text">Collect!</div>`;
      } else {
        innerHTML += `
            <div class="station-progress-container">
              <div class="station-progress-bar" style="width: ${progress}%"></div>
            </div>`;
      }

      if (stationDiv.innerHTML !== innerHTML) {
        stationDiv.innerHTML = innerHTML;
      }
    });
  };

  const finishCooking = (index) => {
    const station = gameState.kitchen.stations[index];
    if (!station) return;
    const recipe = recipes.find((r) => r.id === station.recipeId);

    // Add to inventory
    gameState.inventory[recipe.emoji] =
      (gameState.inventory[recipe.emoji] || 0) + 1;
    // showNotification(`Cooked ${recipe.emoji} ${recipe.name}!`);

    gameState.kitchen.stations[index] = null; // Free the stove
    playSound("tap.wav");
    updateUI();
    updateKitchenStations();
    saveGame();
  };

  const buyRecipe = (recipeId) => {
    const recipe = recipes.find((r) => r.id === recipeId);
    if (!recipe) return;

    if (gameState.kitchen.unlockedRecipes.includes(recipeId)) {
      showNotification("You already have this recipe!");
      return;
    }

    if (gameState.money - recipe.cost < 50) {
      showNotification(`can't buy, not good for your 🪙 health`);
      return;
    }

    if (gameState.money < recipe.cost) {
      showNotification("Not enough money to buy this recipe!");
      return;
    }

    showPopup(
      `Buy ${recipe.emoji} ${recipe.name} recipe for 🪙${recipe.cost}?`,
    ).then((confirmed) => {
      if (confirmed) {
        gameState.money -= recipe.cost;
        gameState.kitchen.unlockedRecipes.push(recipeId);
        updateUI();
        populateRecipes();
        saveGame();
        showNotification(`Unlocked ${recipe.emoji} ${recipe.name}!`);
        playSound("tap.wav");

        generateKitchenQuests();
      }
    });
  };

  const buyStove = (index, cost) => {
    if (gameState.money - cost < 50) {
      showNotification(`can't buy, not good for your 🪙 health`);
      return;
    }

    if (gameState.money < cost) {
      showNotification("Not enough money to buy this stove!");
      return;
    }

    if (index !== gameState.kitchen.unlockedCount) {
      showNotification("You must buy stoves in order!");
      return;
    }

    showPopup(`Buy Stove #${index + 1} for 🪙${cost}?`).then((confirmed) => {
      if (confirmed) {
        gameState.money -= cost;
        gameState.kitchen.unlockedCount++;
        updateUI();
        updateKitchenStations();
        saveGame();
        showNotification(`Unlocked Stove #${index + 1}!`);
        playSound("tap.wav");
      }
    });
  };

  const stopQRScanner = () => {
    if (html5QrCode) {
      html5QrCode
        .stop()
        .then(() => {
          html5QrCode.clear();
          html5QrCode = null;
          _("#transfer-reader").style.display = "none";
          _("#transfer-scan-btn").textContent = "📷 Scan QR Code";
        })
        .catch((err) => {
          console.error("Stop error", err);
          // Force cleanup even if stop fails
          html5QrCode = null;
          _("#transfer-reader").style.display = "none";
          _("#transfer-scan-btn").textContent = "📷 Scan QR Code";
        });
    }
  };

  // Initialize the game
  initTransfer();
  initGame();
})();
