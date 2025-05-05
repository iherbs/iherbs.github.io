(function () {
    // Game state
    const gameState = {
        money: 100,
        time: 0,
        dayDuration: 60, // seconds per in-game day
        realTimeScale: 60, // 1 real second = 60 game seconds (1:60 ratio)
        lastPlayed: null,
        emoji: 'twemoji',
        level: 1,
        points: 0,
        quests: [],
        plotCount: 4,
        plots: [],
        inventory: {},
        selectedSeed: null,
        plantTypes: [
            { emoji: '🌾', name: 'Wheat', growthTime: 6, value: 10, cost: 5 },
            { emoji: '🌽', name: 'Corn', growthTime: 8, value: 15, cost: 8 },
            { emoji: '🥕', name: 'Carrot', growthTime: 11, value: 15, cost: 10 },
            { emoji: '🥜', name: 'Peanuts', growthTime: 11, value: 16, cost: 11 },
            { emoji: '🫘', name: 'Beans', growthTime: 13, value: 16, cost: 12 },
            { emoji: '🥒', name: 'Cucumber', growthTime: 13, value: 17, cost: 14 },
            { emoji: '🌶️', name: 'Pepper', growthTime: 17, value: 20, cost: 15 },
            { emoji: '🫑', name: 'Bell Pepper', growthTime: 18, value: 22, cost: 16 },
            { emoji: '🥔', name: 'Potato', growthTime: 27, value: 30, cost: 20 },
            { emoji: '🍆', name: 'Eggplant', growthTime: 25, value: 20, cost: 15 },
            { emoji: '🍅', name: 'Tomato', growthTime: 30, value: 25, cost: 20 },
            { emoji: '🫛', name: 'Peas', growthTime: 25, value: 20, cost: 15 },
            { emoji: '🥬', name: 'Lettuce', growthTime: 28, value: 20, cost: 16 },
            { emoji: '🥦', name: 'Broccoli', growthTime: 30, value: 25, cost: 18 },
            { emoji: '🍎', name: 'Apple', growthTime: 30, value: 25, cost: 20 },
            { emoji: '🍓', name: 'Strawberry', growthTime: 26, value: 25, cost: 18 },
            { emoji: '🍐', name: 'Pear', growthTime: 30, value: 25, cost: 20 },
            { emoji: '🍊', name: 'Orange', growthTime: 30, value: 28, cost: 22 },
            { emoji: '🍋', name: 'Lemon', growthTime: 35, value: 32, cost: 25 },
            { emoji: '🍋‍🟩', name: 'Lime', growthTime: 33, value: 30, cost: 24 },
            { emoji: '🍌', name: 'Banana', growthTime: 40, value: 38, cost: 30 },
            { emoji: '🍉', name: 'Watermelon', growthTime: 40, value: 38, cost: 32 },
            { emoji: '🍇', name: 'Grapes', growthTime: 45, value: 45, cost: 35 },
            { emoji: '🫐', name: 'Blueberries', growthTime: 44, value: 44, cost: 37 },
            { emoji: '🍈', name: 'Melon', growthTime: 50, value: 48, cost: 40 },
            { emoji: '🍒', name: 'Cherry', growthTime: 50, value: 45, cost: 38 },
            { emoji: '🍑', name: 'Peach', growthTime: 60, value: 55, cost: 44 },
            { emoji: '🥭', name: 'Mango', growthTime: 55, value: 50, cost: 42 },
            { emoji: '🍍', name: 'Pineapple', growthTime: 55, value: 50, cost: 45 },
            { emoji: '🥥', name: 'Coconut', growthTime: 57, value: 52, cost: 46 },
            { emoji: '🥝', name: 'Kiwi', growthTime: 62, value: 58, cost: 48 },
            { emoji: '🥑', name: 'Avocado', growthTime: 60, value: 55, cost: 50 },
            { emoji: '🍄', name: 'Mushroom', growthTime: 68, value: 62, cost: 55 },
            { emoji: '🌹', name: 'Rose', growthTime: 66, value: 58, cost: 50 },
            { emoji: '🌷', name: 'Tulip', growthTime: 67, value: 61, cost: 55 },
            { emoji: '🪻', name: 'Hyacinth', growthTime: 68, value: 63, cost: 58 },
            { emoji: '🪷', name: 'Lotus', growthTime: 70, value: 66, cost: 60 },
            { emoji: '🌺', name: 'Hibiscus', growthTime: 72, value: 68, cost: 62 },
            { emoji: '🌼', name: 'Daisy', growthTime: 75, value: 70, cost: 65 },
            { emoji: '🌻', name: 'Sunflower', growthTime: 80, value: 80, cost: 70 },
            { emoji: '🌸', name: 'Sakura', growthTime: 110, value: 100, cost: 80 },
            { emoji: '🟫', name: 'Land', growthTime: 0, value: 0, cost: 300 }
        ],
        growthItems: [
            { emoji: '💧', name: 'Water', growthBoost: 2, cost: 20 },
            { emoji: '🧴', name: 'Fertilizer', growthBoost: 5, cost: 50 },
            { emoji: '🧪', name: 'Potion', growthBoost: 10, cost: 100 }
        ],
        gameInterval: null,
        npcs: [
            '🧔🏻‍♂️', '🧔🏻', '🤡', '👻', '🤖', '👽', '🧜🏻‍♂️', '🧚🏻‍♂️',
            '🧞‍♂️', '🧝🏻‍♂️', '🧙🏻‍♂️', '🧛🏻‍♂️', '🧟‍♂️', '🥷🏻', '🎅🏻',
            '💂🏻‍♂️', '🤴🏻', '👷🏻‍♂️', '👮🏻‍♂️', '🕵🏻‍♂️', '👨🏻‍✈️', '👨🏻‍🔬',
            '👨🏻‍⚕️', '👨🏻‍🔧', '👨🏻‍🏭', '👨🏻‍🚒', '👨🏻‍🌾', '👨🏻‍💼',
            '👨🏻‍⚖️', '👨🏻‍🎤', '👨🏻‍🎨', '👨🏻‍🍳', '🧕🏻', '👳🏻‍♂️',
            '👲🏻', '👨🏻‍🦳', '👨🏻‍🦱', '👨🏻‍🦲', '🕴🏻', '💃🏻', '🕺🏻'
        ],
        pet: null,
        petTypes: [
            { id: 'dog', name: 'Dog', emoji: '🐕', cost: 500 },
            { id: 'cat', name: 'Cat', emoji: '🐈', cost: 500 },
            { id: 'rabbit', name: 'Rabbit', emoji: '🐇', cost: 700 },
            { id: 'butterfly', name: 'Butterfly', emoji: '🦋', cost: 1100 },
            { id: 'swan', name: 'Swan', emoji: '🦢', cost: 1300 },
            { id: 'snail', name: 'Snail', emoji: '🐌', cost: 1500 },
            { id: 'poodle', name: 'Poodle', emoji: '🐩', cost: 1800 },
            { id: 'black_cat', name: 'Black Cat', emoji: '🐈‍⬛', cost: 2100 },
            { id: 'jellyfish', name: 'Jellyfish', emoji: '🪼', cost: 2500 },
            { id: 'crab', name: 'Crab', emoji: '🦀', cost: 2900 },
            { id: 'pufferfish', name: 'Pufferfish', emoji: '🐡', cost: 3300 },
            { id: 'tropical_fish', name: 'Tropicfish', emoji: '🐠', cost: 3700 },
            { id: 'dodo', name: 'Dodo', emoji: '🦤', cost: 4100 },
            { id: 'hedgehog', name: 'Hedgehog', emoji: '🦔', cost: 4500 },
            { id: 'dinosaur', name: 'Dinosaur', emoji: '🦖', cost: 5000 }
        ],
        petFoods: [
            { id: 'lollipop', name: 'Lollipop', emoji: '🍭', cost: 50, hungerValue: 20 },
            { id: 'chocolate', name: 'Chocolate', emoji: '🍫', cost: 100, hungerValue: 40 }
        ],
        petFeedItems: [
            { emoji: '🌾', hungerValue: 2 },
            { emoji: '🌽', hungerValue: 3 },
            { emoji: '🥕', hungerValue: 4 }
        ], // Tanaman yang bisa digunakan untuk memberi makan
        autoHarvestInterval: 1,
        checksum: '',
        music: true,
        sfx: true
    };
    const maxmoney = 999999;

    const _ = (id) => {
        let el = {};
        if (id.substr(0, 1) == "#") {
            el = document.getElementById(id.substr(1, id.length));
        } else if (id.substr(0, 1) == ".") {
            el = document.querySelectorAll(id);
        } else if (id.substr(0, 1) == "@") {
            el = document.getElementsByName(id.substr(1, id.length));
        }
        if (!el) { console.warn(`Element ${id} not found`); }
        return el;
    }

    // DOM elements
    const farmGrid = _('#farm-grid');
    const marketItems = _('#market-items');
    const moneyDisplay = _('#money');
    const inventoryDisplay = _('#inventory');
    const notification = _('#notification');
    const timeProgressBar = _('#time-progress');
    const lastPlayedDisplay = _('#last-played');
    const levelDisplay = _('#level');
    const pointsProgress = _('#points-progress');
    const pointsText = _('#points-text');
    const questContent = _('#quest-content');
    const setting = _('#setting');
    const marketbtn = _('#market-button');

    const popupOverlay = _('#popup-overlay');
    const popupTitle = _('#popup-title');
    const popupMessage = _('#popup-message');
    const popupConfirm = _('#popup-confirm');
    const popupCancel = _('#popup-cancel');

    // Initialize the game
    const initGame = () => {
        if (!localStorage.getItem('emojiFarm')) {
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
    }

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
                        <li>You have 20 moves to reach 500 points. If you succeed, you’ll earn 🪙.</li>
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
        showPopup(tutorialContent, 'How to Play', false);
    };

    const music = _("#background-audio");
    music.volume = 0.9;
    document.addEventListener("click", () => {
        if (gameState.music) {
            music.play().catch(e => {
                console.log("Autoplay blocked, but user clicked!");
            });
        }
    });

    // Play sound effect
    const sfx = _('#sfx');
    const playSound = (soundFile) => {
        if (gameState.sfx) {
            const audio = new Audio(`music/${soundFile}`);
            audio.play();
        }
    };

    const toggleMarket = () => {
        if (_('#market').style.transform == 'translateY(0px)') {
            _('#market').style.transform = 'translateY(170px)';
        } else {
            _('#market').style.transform = 'translateY(0px)';
        }
    }

    _("#market-button").addEventListener('click', () => {
        toggleMarket();
    });

    _("#market-close").addEventListener('click', () => {
        toggleMarket();
    });

    const setupMarketTabs = () => {
        document.querySelectorAll('.market-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                // Hapus class active dari semua tab
                document.querySelectorAll('.market-tab').forEach(t => t.classList.remove('active'));
                // Tambahkan class active ke tab yang diklik
                tab.classList.add('active');
                // Tampilkan konten yang sesuai
                const tabType = tab.dataset.tab;
                _('#market-items').style.display = tabType === 'seed' ? 'flex' : 'none';
                _('#growth-items').style.display = tabType === 'growth' ? 'flex' : 'none';
            });
        });
    };

    const populateGrowthItems = () => {
        const growthItemsContainer = _('#growth-items');
        growthItemsContainer.innerHTML = '';

        gameState.growthItems.forEach(item => {
            const marketItem = document.createElement('div');
            marketItem.className = 'market-item';
            marketItem.dataset.emoji = item.emoji;
            marketItem.innerHTML = `
                <div class="market-item-emoji">${item.emoji}</div>
                <div class="market-item-name">${item.name}</div>
                <div class="market-item-cost">🪙${item.cost}</div>
            `;
            marketItem.addEventListener('click', () => {
                // Hapus class selected dari semua item
                document.querySelectorAll('.market-item').forEach(i => i.classList.remove('selected'));
                // Tambahkan class selected ke item yang diklik
                marketItem.classList.add('selected');
                gameState.selectedSeed = item.emoji;
                marketbtn.innerHTML = item.emoji;
                toggleMarket();
            });
            growthItemsContainer.appendChild(marketItem);
        });
    };

    // Dapatkan tanaman yang tersedia di market berdasarkan level
    const getAvailablePlants = (level) => {
        // Pada Level 1, hanya Wheat dan Corn
        const basePlants = gameState.plantTypes.slice(0, 2); // 🌾, 🌽
        // Tambah 1 tanaman per level setelah Level 1
        const additionalPlants = level > 1 ? gameState.plantTypes.slice(2, 2 + (level - 1)) : [];
        // Selalu sertakan Land
        const landPlant = gameState.plotCount < 16 ? gameState.plantTypes.find(p => p.emoji === '🟫') : [];
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
    }

    // Populate market items
    const populateMarket = () => {
        marketItems.innerHTML = '';

        const availablePlants = getAvailablePlants(gameState.level);

        availablePlants.forEach(plant => {
            const item = document.createElement('div');
            item.className = 'market-item';
            item.dataset.emoji = plant.emoji;
            item.innerHTML = `
                <div class="market-item-emoji">${plant.emoji}</div>
                <div class="market-item-name">${plant.name}</div>
                <div class="market-item-cost">🪙${plant.cost}</div>
            `;
            item.addEventListener('click', async () => {
                // Remove selected class from all items
                document.querySelectorAll('.market-item').forEach(i => i.classList.remove('selected'));
                if (plant.emoji == "🟫") {
                    let confirmed = await showPopup('<span style="font-size:20px;">Buy Land 🟫?</span>');
                    if (confirmed) {
                        const seedCost = getPlantCost(plant.emoji);
                        if (gameState.money >= seedCost) {
                            if ((gameState.money - seedCost) >= 50) {
                                gameState.money -= seedCost;
                                gameState.plotCount++;
                                gameState.plantTypes.find(p => p.emoji === '🟫').cost = gameState.plantTypes.find(p => p.emoji === '🟫').cost + 300;
                                updateUI();
                                createFarmPlots();
                                populateMarket();
                                toggleMarket();
                                showNotification(`New Land 🟫 Added!`);
                            } else {
                                showNotification(`can't buy, not good for your 🪙 health`);
                            }
                        } else {
                            showNotification(`Not enough 🪙 to buy Land!`);
                        }
                    }
                } else {
                    // Add selected class to clicked item
                    item.classList.add('selected');
                    gameState.selectedSeed = plant.emoji;
                    marketbtn.innerHTML = plant.emoji;
                    toggleMarket();
                    // showNotification(`Selected ${plant.name} for planting!`);
                }
            });
            marketItems.appendChild(item);
        });
    }

    // Calculate growth while game was closed
    const calculateOfflineProgress = () => {
        if (!gameState.lastPlayed) return;
        const now = new Date();
        const lastPlayed = new Date(gameState.lastPlayed);
        const secondsPassed = (now - lastPlayed) / 1000;
        const gameSecondsPassed = secondsPassed * gameState.realTimeScale;
        if (gameSecondsPassed > 0) {
            const maxDays = 30; // Batas maksimum 30 hari offline
            const daysPassed = Math.min(Math.floor(gameSecondsPassed / gameState.dayDuration), maxDays);
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
        }
    }

    // Create farm plots
    const createFarmPlots = () => {
        farmGrid.innerHTML = '';

        // Adjust plot count based on screen size
        const screenWidth = window.innerWidth;

        // Initialize plots array if needed
        while (gameState.plots.length < gameState.plotCount) {
            gameState.plots.push({ plant: null, growth: 0, plantedAt: null });
        }

        // Trim if we have more plots than needed
        gameState.plots = gameState.plots.slice(0, gameState.plotCount);

        for (let i = 0; i < gameState.plotCount; i++) {
            const plot = document.createElement('div');
            plot.className = 'plot';
            plot.dataset.index = i;

            const plant = document.createElement('div');
            plant.className = 'plant grow-animation';
            plant.textContent = gameState.plots[i].plant || '';

            const progressContainer = document.createElement('div');
            progressContainer.className = 'progress-container';

            const progressIcon = document.createElement('div');
            progressIcon.textContent = gameState.plots[i].plant || '';
            progressIcon.className = 'progress-icon';


            const progressWrap = document.createElement('div');
            progressWrap.className = 'progress-wrap';

            const progressBar = document.createElement('div');
            progressBar.className = 'progress-bar';

            // Calculate growth progress
            if (gameState.plots[i].plant) {
                const growthTime = getGrowthTime(gameState.plots[i].plant);
                const growthProgress = Math.min(gameState.plots[i].growth, growthTime);
                progressBar.style.width = `${(growthProgress / growthTime) * 100}%`;
            } else {
                progressBar.style.width = '0%';
            }

            progressContainer.appendChild(progressIcon);
            progressContainer.appendChild(progressWrap);
            progressWrap.appendChild(progressBar);
            plot.appendChild(plant);
            plot.appendChild(progressContainer);

            plot.addEventListener('click', () => handlePlotClick(i));
            farmGrid.appendChild(plot);
        }

        for (let j = gameState.plotCount; j < 16; j++) {
            const plot = document.createElement('div');
            plot.className = 'plot';
            plot.innerHTML = '<div class="plant"></div>';
            farmGrid.appendChild(plot);
        }
    }

    // Handle plot click
    const handlePlotClick = async (index) => {
        const plot = gameState.plots[index];

        // console.log(gameState.selectedSeed);
        playSound('tap.wav');
        if (!plot.plant) {
            // Plant a seed if empty and seed is selected
            if (gameState.selectedSeed) {
                const item = gameState.plantTypes.find(i => i.emoji === gameState.selectedSeed);
                if (item != undefined) {
                    const seedCost = getPlantCost(gameState.selectedSeed);

                    if (gameState.money >= seedCost) {
                        plot.plant = gameState.selectedSeed;
                        plot.growth = 0;
                        plot.plantedAt = new Date().toISOString();
                        gameState.money -= seedCost;
                        updatePlotUI(index);
                        updateUI();
                        // showNotification(`Planted ${getPlantName(gameState.selectedSeed)} for 🪙${seedCost}!`);
                        // gameState.selectedSeed = null;
                        // Reset selected item in market
                        // document.querySelectorAll('.market-item').forEach(i => i.classList.remove('selected'));
                        saveGame();
                    } else {
                        showNotification(`Not enough 🪙 to buy ${gameState.selectedSeed}!`);
                        // Reset selected item in market
                        // document.querySelectorAll('.market-item').forEach(i => i.classList.remove('selected'));
                    }
                } else {
                    // gameState.selectedSeed = null;
                    // document.querySelectorAll('.market-item').forEach(i => i.classList.remove('selected'));
                }
            } else {
                toggleMarket();
            }
        } else if (plot.plant && isReadyToHarvest(index)) {
            // Harvest if ready
            harvestPlant(index);
        } else if (plot.plant && gameState.selectedSeed) {
            // Gunakan item percepatan jika tanaman ada dan item dipilih
            const item = gameState.growthItems.find(i => i.emoji === gameState.selectedSeed);
            if (item != undefined) {
                if (gameState.money >= item.cost) {
                    if (gameState.money - item.cost >= 50) {
                        playSound('growth.wav');
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
                            const progressWrap = plotElement.querySelector('.progress-wrap');
                            progressWrap.classList.add('power-growth-animation');
                            setTimeout(() => {
                                progressWrap.classList.remove('power-growth-animation');
                            }, 500);
                        }
                        // document.querySelectorAll('.market-item').forEach(i => i.classList.remove('selected'));
                        saveGame();
                    } else {
                        showNotification(`can't buy, not good for your 🪙 health`);
                    }
                } else {
                    showNotification(`Not enough 🪙 to use ${item.emoji}!`);
                }
            }
            // gameState.selectedSeed = null;
            // document.querySelectorAll('.market-item').forEach(i => i.classList.remove('selected'));
        }
    }

    // Check if plant is ready to harvest
    const isReadyToHarvest = (index) => {
        const plot = gameState.plots[index];
        return plot.growth >= getGrowthTime(plot.plant);
    }

    // Harvest a plant
    const harvestPlant = (index, ispet = false) => {
        const plot = gameState.plots[index];
        const plantEmoji = plot.plant;
        const plantValue = getPlantValue(plantEmoji);
        if (plantEmoji != '🐾') {
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
            if (gameState.pet && gameState.pet.hunger >= 20) {
                plot.plant = '🐾';
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
    }

    // Start the game loop for automatic day progression
    const startGameLoop = () => {
        if (gameState.gameInterval) { clearInterval(gameState.gameInterval); }
        let lastAutoHarvest = 0;
        gameState.gameInterval = setInterval(() => {
            gameState.time += 0.1;

            // Kurangi hunger setiap hari (10 per hari, 60 detik)
            if (gameState.pet) {
                gameState.pet.hunger = Math.max(gameState.pet.hunger - (3 / (gameState.dayDuration / 0.1)), 0);
                updatePetUI();
                if (gameState.pet.hunger < 20 && gameState.pet.hunger >= 19.9) {
                    showNotification(`${gameState.pet.emoji} is hungry! Feed your pet.`);
                }
            }

            // Panen otomatis setiap 2 detik
            lastAutoHarvest += 0.1;
            if (lastAutoHarvest >= gameState.autoHarvestInterval) {
                autoHarvest();
                lastAutoHarvest = 0;
            }

            updateTimeDisplay();
            const hasGrowingPlants = gameState.plots.some(plot => plot.plant);
            if (hasGrowingPlants) { updatePlantGrowth(0.1); }
            if (gameState.time >= gameState.dayDuration) { nextDay(); }
        }, 100);
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
    }

    // Update time display
    const updateTimeDisplay = () => {
        const progressPercent = (gameState.time / gameState.dayDuration) * 100;
        timeProgressBar.style.width = `${progressPercent}%`;
    }

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
    }

    // Complete day transition
    const nextDay = () => {
        advanceDay();
        gameState.time = 0;
        updateTimeDisplay();
        updateUI();
        // showNotification(`Day ${gameState.day} begins!`);
        saveGame();
    }

    // Update a single plot's UI
    const updatePlotUI = (index) => {
        if (farmGrid.children[index] != null) {
            const plotElement = farmGrid.children[index];
            const plot = gameState.plots[index];
            const plantElement = plotElement.querySelector('.plant');
            const progressBar = plotElement.querySelector('.progress-bar');
            const progressIcon = plotElement.querySelector('.progress-icon');

            if (plot.plant) {
                // Show seedling if not fully grown
                if (plot.growth < getGrowthTime(plot.plant)) {
                    plantElement.textContent = '🌱';
                    plantElement.classList.remove('wave-animation');
                    plantElement.classList.add('grow-animation');
                    progressIcon.textContent = plot.plant;
                } else {
                    plantElement.textContent = plot.plant;
                    plantElement.classList.add('wave-animation');
                    plantElement.classList.remove('grow-animation');
                    progressIcon.textContent = '';
                }

                progressBar.style.width = `${(plot.growth / getGrowthTime(plot.plant)) * 100}%`;
            } else {
                progressIcon.textContent = '';
                plantElement.textContent = '';
                progressBar.style.width = '0%';
            }
        }
    }

    // Update all UI elements
    const updateUI = () => {
        moneyDisplay.textContent = gameState.money;
        levelDisplay.textContent = gameState.level;
        const pointsNeeded = getPointsNeededForNextLevel(gameState.level);
        pointsProgress.style.width = `${(gameState.points / pointsNeeded) * 100}%`;
        pointsText.textContent = `${gameState.points}/${pointsNeeded}`;

        // Update inventory display
        inventoryDisplay.innerHTML = '';
        Object.entries(gameState.inventory).forEach(([emoji, count]) => {
            if (count > 0) {
                const item = document.createElement('div');
                item.className = 'inventory-item';
                item.style.cursor = 'pointer'; // Visual feedback bahwa item bisa diklik
                item.innerHTML = `
                    <span>${emoji}</span>
                    <span class="inventory-count">${count}</span>
                `;
                // Tambahkan event listener untuk penjualan
                item.addEventListener('click', () => {
                    const plantName = getPlantName(emoji);
                    showPopup(`
                        Sell ${plantName} (${emoji}) for 🪙${(getPlantCost(emoji) + 2)} each?<br>
                        <button type="button" id="qtysellmin" style="position:relative;top:2px;padding:5px;background:#ffffff;color:#000000;">➖</button>
                        <input type="number" id="sell-quantity" min="1" max="${count}" value="${count}" style="width:100px;margin:10px;padding:5px 8px;border-radius: 5px;border:2px solid #2E8B57;text-align:right;outline:none;">
                        <button type="button" id="qtyselladd" style="position:relative;top:2px;padding:5px;background:#ffffff;color:#000000;">➕</button>
                        <div>Total: 🪙<span id="sell-total">${count * (getPlantCost(emoji) + 2)}</span></div>
                    `).then(confirmed => {
                        if (confirmed) {
                            const quantityInput = _('#sell-quantity');
                            const quantity = parseInt(quantityInput.value);
                            if (quantity > 0 && quantity <= count) {
                                gameState.money += quantity * (getPlantCost(emoji) + 2) || 0;
                                gameState.money = gameState.money > maxmoney ? maxmoney : gameState.money;
                                gameState.inventory[emoji] -= quantity;
                                if (gameState.inventory[emoji] <= 0) {
                                    delete gameState.inventory[emoji];
                                }
                                updateUI();
                                saveGame();
                                showNotification(`Sold ${quantity} ${plantName} for 🪙${quantity * getPlantValue(emoji)}!`);
                            }
                        }
                    });

                    _('#sell-quantity').addEventListener('input', (e) => {
                        let quantity = parseInt(e.target.value);
                        if (quantity < 1) { quantity = 1; }
                        if (quantity > count) { quantity = count; }
                        if (isNaN(quantity)) {
                            quantity = 0;
                        } else {
                            e.target.value = quantity;
                        }
                        _('#sell-total').textContent = quantity * (getPlantCost(emoji) + 2);
                    });

                    _('#qtysellmin').addEventListener('click', () => {
                        let qty = parseInt(_('#sell-quantity').value) - 1;
                        if (qty < 1) {
                            qty = 1;
                            _('#sell-quantity').value = 1;
                        } else {
                            _('#sell-quantity').value = qty;
                        }
                        _('#sell-total').textContent = qty * (getPlantCost(emoji) + 2);
                    });

                    _('#qtyselladd').addEventListener('click', () => {
                        let qty = parseInt(_('#sell-quantity').value) + 1;
                        if (qty > count) {
                            qty = count
                            _('#sell-quantity').value = count;
                        } else {
                            _('#sell-quantity').value = qty;
                        }
                        _('#sell-total').textContent = qty * (getPlantCost(emoji) + 2);
                    });
                });
                inventoryDisplay.appendChild(item);
            }
        });

        // Perbarui quest UI untuk memeriksa ketersediaan inventory
        updateQuestUI();
    }

    // Update last played display
    const updateLastPlayedDisplay = () => {
        if (gameState.lastPlayed) {
            const lastPlayed = new Date(gameState.lastPlayed);
            lastPlayedDisplay.textContent = `Last played: ${lastPlayed.toLocaleString()}`;
        }
    }

    // Show notification
    let notificationTimeout;
    const showNotification = (message) => {
        clearTimeout(notificationTimeout);
        notification.classList.remove('show-notification');
        notification.textContent = message;
        notification.classList.add('show-notification');
        notificationTimeout = setTimeout(() => {
            notification.classList.remove('show-notification');
        }, 3000);
    };

    // Helper functions to get plant info
    const getGrowthTime = (emoji) => {
        const plant = gameState.plantTypes.find(p => p.emoji === emoji);
        return plant ? plant.growthTime : 0;
    }

    const getPlantValue = (emoji) => {
        const plant = gameState.plantTypes.find(p => p.emoji === emoji);
        return plant ? plant.value : 0;
    }

    const getPlantCost = (emoji) => {
        const plant = gameState.plantTypes.find(p => p.emoji === emoji);
        return plant ? plant.cost : 0;
    }

    const getPlantName = (emoji) => {
        const plant = gameState.plantTypes.find(p => p.emoji === emoji);
        return plant ? plant.name : 'Unknown Plant';
    }
    const calculateChecksum = (data) => {
        const str = JSON.stringify({
            money: data.money,
            level: data.level,
            points: data.points,
            inventory: data.inventory,
            plots: data.plots,
            plotCount: data.plotCount,
            plantTypes: data.plantTypes,
            pet: data.pet
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
        localStorage.setItem('emojiFarm', JSON.stringify(gameState));
        updateLastPlayedDisplay();
    }

    // Load game from localStorage
    const loadGame = () => {
        const savedGame = localStorage.getItem('emojiFarm');
        if (savedGame) {
            try {
                const parsed = JSON.parse(savedGame);
                const expectedChecksum = calculateChecksum(parsed);
                if (parsed.checksum !== expectedChecksum) {
                    throw new Error('Data tampered');
                }

                // Migrate old save format if needed
                if (!parsed.plots) {
                    parsed.plots = Array(parsed.plotCount || 4).fill().map(() => ({ plant: null, growth: 0, plantedAt: null }));
                }

                // Migrate growth if not present        
                if (!parsed.growthItems) {
                    parsed.growthItems = gameState.growthItems;
                }

                // Migrate quests if not present or old format (single quest)
                if (!parsed.quests) {
                    parsed.quests = parsed.quest ? [parsed.quest] : [];
                    delete parsed.quest;
                }

                // Migrate questCompletedCount if not present
                if (!parsed.questCompletedCount) {
                    parsed.questCompletedCount = parsed.quests.reduce((sum, q) => sum + (q.completedCount || 0), 0);
                }

                // Migrate level and points if not present
                if (!parsed.level) {
                    parsed.level = 1;
                }
                if (!parsed.emoji) {
                    parsed.emoji = 'twemoji';
                }
                if (!parsed.points) {
                    parsed.points = 0;
                }

                if (parsed.plotCount > 16) {
                    parsed.plotCount = 16;
                }

                if (!parsed.pet) {
                    parsed.pet = null;
                }

                if (!parsed.hasOwnProperty('music')) {
                    parsed.music = true;
                }

                if (!parsed.hasOwnProperty('sfx')) {
                    parsed.sfx = true;
                }

                // Ensure each plot has plantedAt property
                parsed.plots.forEach(plot => {
                    if (!plot.plantedAt && plot.plant) {
                        plot.plantedAt = new Date().toISOString();
                    }
                });

                parsed.money = parsed.money > maxmoney ? maxmoney : parsed.money;

                // Migrate plantTypes
                const plantTypes = gameState.plantTypes;
                plantTypes.find(p => p.emoji === '🟫').cost = parsed.plantTypes.find(p => p.emoji === '🟫').cost;

                Object.assign(gameState, parsed);
                gameState.plantTypes = plantTypes;

                document.body.className = gameState.emoji;
                calculateOfflineProgress();
            } catch (e) {
                console.error('Failed to load save:', e);
            }
        }

        // Pastikan ada hingga 3 quest saat memuat
        generateQuests();
    }

    // Show popup with message and return a Promise
    const showPopup = (message, title = '', btnok = true) => {
        return new Promise((resolve) => {
            title = title == '' ? 'Confirm' : title;
            popupTitle.innerHTML = title
            popupMessage.innerHTML = message;
            popupOverlay.classList.add('show');

            if (btnok) {
                popupConfirm.style.display = "block";
            } else {
                popupConfirm.style.display = "none";
            }

            // Event listener untuk tombol Confirm
            const confirmHandler = () => {
                popupOverlay.classList.remove('show');
                popupConfirm.removeEventListener('click', confirmHandler);
                popupCancel.removeEventListener('click', cancelHandler);
                resolve(true);
            };

            // Event listener untuk tombol Cancel
            const cancelHandler = () => {
                popupOverlay.classList.remove('show');
                popupConfirm.removeEventListener('click', confirmHandler);
                popupCancel.removeEventListener('click', cancelHandler);
                resolve(false);
            };

            popupConfirm.addEventListener('click', confirmHandler);
            popupCancel.addEventListener('click', cancelHandler);
        });
    }

    window.onclick = (event) => {
        // console.log(event.target);
        if (!event.target.matches('.plot') && !event.target.matches('.plant') && !event.target.matches('.progress-container') && !event.target.matches('.progress-wrap') && !event.target.matches('.progress-icon') && !event.target.matches('.farm-grid') && !event.target.matches('.market') && !event.target.matches('.market-items') && !event.target.matches('.market-item') && !event.target.matches('.market-item-emoji') && !event.target.matches('.market-item-name') && !event.target.matches('.market-item-cost') && !event.target.matches('#pet-emoji-container') && !event.target.matches('#pet-emoji')) {
            gameState.selectedSeed = null;
            marketbtn.innerHTML = '🌱';
            document.querySelectorAll('.market-item').forEach(i => i.classList.remove('selected'));
        }
    };

    // Menu ==================================================
    _('#menu-inventory').addEventListener('click', async () => {
        _('#wrappets').style.display = 'none';
        if (_('#wrapinventory').style.display == 'block') {
            _('#wrapinventory').style.display = 'none';
        } else {
            _('#wrapinventory').style.display = 'block'
        }
    });

    _('#inventory-close').addEventListener('click', () => {
        _('#wrapinventory').style.display = 'none';
    });
    _('#menu-pet').addEventListener('click', async () => {
        _('#wrapinventory').style.display = 'none';
        if (_('#wrappets').style.display == 'block') {
            _('#wrappets').style.display = 'none';
        } else {
            _('#wrappets').style.display = 'block'
            buyPet();
        }
    });

    _('#pet-close').addEventListener('click', () => {
        _('#wrappets').style.display = 'none';
    });
    // End Menu ==================================================

    _('#inventory-close').addEventListener('click', () => {
        _('#wrapinventory').style.display = 'none';
    });

    let reset = false;
    setting.addEventListener('click', async () => {
        let emofont = document.body.className;
        const set = showPopup(`
            <button type="button" id="resetgame">
                Reset Game
            </button>
            <div style="margin-top:10px">
                Music
                <label class="switch">
                    <input type="checkbox" id="btnmusic" ${gameState.music ? 'checked' : ''}>
                    <span class="slider round"></span>
                </label>
            </div>
            <div style="margin-top:10px">
                SFX
                <label class="switch">
                    <input type="checkbox" id="btnsfx" ${gameState.sfx ? 'checked' : ''}>
                    <span class="slider round"></span>
                </label>
            </div>
            <div style="margin-top:10px">
                <div class="custom-select">
                    <div class="selected-option" id="selectedEmoji">
                        <span id="selected-font" class="${emofont}">🌾🌽🪙</span>
                        <span class="arrow">▼</span>
                    </div>
                    <div class="options" id="font-options" style="display:none;">
                        <span class="selectEmoji defemoji" data="defemoji">🌾🌽🪙</span>
                        <span class="selectEmoji twemoji" data="twemoji">🌾🌽🪙</span>
                        <span class="selectEmoji notoemoji" data="notoemoji">🌾🌽🪙</span>
                    </div>
                </div>
            </div>
            <div style="margin-top:15px">
                <span id="help" class="buttonaddition">❓</span>
            </div>
        `, 'Setting', false);

        _('#selectedEmoji').addEventListener('click', () => {
            if (_("#font-options").style.display == "block") {
                _("#font-options").style.display = "none";
            } else {
                _("#font-options").style.display = "block";
            }
        });

        const selectemoji = document.querySelectorAll('.selectEmoji')
        selectemoji.forEach(element => {
            element.addEventListener('click', function () {
                const attr = element.getAttribute('data');
                _("#font-options").style.display = "none";

                document.getElementById("selected-font").className = attr;
                document.body.className = attr;
                gameState.emoji = attr;
                saveGame();
            });
        });

        _('#help').addEventListener('click', showTutorial);

        _('#btnmusic').addEventListener('click', () => {
            gameState.music = _('#btnmusic').checked;
            if (!_('#btnmusic').checked) {
                music.pause();
            }
            saveGame();
        });

        _('#btnsfx').addEventListener('click', () => {
            gameState.sfx = _('#btnsfx').checked;
            saveGame();
        });

        _('#resetgame').addEventListener('click', async () => {
            const confirmed = await showPopup(`
                Are you sure you want to reset the game? This will erase all progress.<br>
                Type "reset" to confirm.<br><input type="text" id="reset-input" style="width:100px;margin:10px;padding:5px 8px;border-radius:5px;border:2px solid #2E8B57;outline:none;" autocomplete="off">
            `);
            if (confirmed) {
                const resetinput = _('#reset-input').value;
                if (resetinput == "reset") {
                    clearInterval(gameState.gameInterval);
                    localStorage.removeItem('emojiFarm');
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
        gameState.questCompletedCount = gameState.questCompletedCount == undefined ? 0 : gameState.questCompletedCount;
        const availablePlants = getAvailablePlants(gameState.level).filter(p => p.emoji !== '🟫');
        let startIndex = 0;
        if (parseInt(gameState.level) >= 6) {
            startIndex = parseInt(gameState.level) % 2 === 0 ? parseInt(gameState.level) - 10 : parseInt(gameState.level) - 11;
            if (parseInt(gameState.level) > 40) {
                startIndex = 5;
            }
        }
        const min = startIndex < 0 ? 2 : startIndex;
        const max = availablePlants.length - 1;
        const numPlant = Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min);
        const plant = availablePlants[numPlant];
        const baseQuantity = gameState.questCompletedCount > 10 ? Math.floor(Math.random() * 10) + 1 : Math.floor(Math.random() * 3) + 1;
        const quantity = gameState.level > 6 ? baseQuantity + 2 : baseQuantity;
        const usedNPCs = gameState.quests.map(q => q.npc);
        const availableNPCs = gameState.npcs.filter(npc => !usedNPCs.includes(npc));
        if (availableNPCs.length === 0) return null; // Cegah quest jika tidak ada NPC
        const npc = availableNPCs[Math.floor(Math.random() * availableNPCs.length)];
        return { npc, plantEmoji: plant.emoji, quantity };
    }

    // Generate quests up to 3
    const generateQuests = () => {
        while (gameState.quests.length < 3 && gameState.npcs.length > gameState.quests.length) {
            const quest = generateSingleQuest();
            if (quest) gameState.quests.push(quest);
        }
        updateQuestUI();
        saveGame();
    }

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

            playSound('done.wav');

            // Tambah poin dan uang
            gameState.points += 2; // 2 poin per quest
            const plantValue = getPlantValue(plantEmoji);
            const reward = (plantValue * quantity);// + (gameState.level * 10);
            gameState.money += reward;
            gameState.money = gameState.money > maxmoney ? maxmoney : gameState.money;

            // Tingkatkan questCompletedCount
            gameState.questCompletedCount += 1;

            // Notifikasi dan update
            showNotification(`Quest completed! Gained 🪙${reward}!`);

            // Periksa kenaikan level
            checkLevelUp();

            // Hapus quest dan tambahkan quest baru
            gameState.quests.splice(index, 1);
            generateQuests();

            updateUI();
        } else {
            showNotification(`Not enough ${plantEmoji}! Need ${quantity}, have ${inventoryCount}.`);
        }
    }

    // Update quest UI
    const updateQuestUI = () => {
        questContent.innerHTML = '';

        gameState.quests.forEach((quest, index) => {
            const { npc, plantEmoji, quantity } = quest;
            const inventoryCount = gameState.inventory[plantEmoji] || 0;
            const isCompletable = inventoryCount >= quantity;

            const questItem = document.createElement('div');
            questItem.className = 'quest-item';
            questItem.innerHTML = `
                <div class="quest-details">
                    ${quantity} ${plantEmoji}
                </div>
                <span class="quest-button" ${isCompletable ? '' : 'style="display:none;"'}><span class="check-icon"></span></span>
                <div class="quest-npc">${npc}</div>
            `;
            // <br>${getPlantName(plantEmoji)}

            questItem.addEventListener('click', () => completeQuest(index));

            questContent.appendChild(questItem);
        });
    }

    // Hitung poin yang dibutuhkan untuk level berikutnya
    const getPointsNeededForNextLevel = (currentLevel) => {
        return 5 * currentLevel; // 5 untuk level 2, 10 untuk level 3, 15 untuk level 4, dst.
    }

    // Periksa dan naikkan level jika poin cukup
    const checkLevelUp = () => {
        let pointsNeeded = getPointsNeededForNextLevel(gameState.level);
        while (gameState.points >= pointsNeeded) {
            gameState.points -= pointsNeeded; // Kurangi poin yang digunakan
            gameState.level += 1; // Naik level
            pointsNeeded = getPointsNeededForNextLevel(gameState.level); // Hitung poin untuk level berikutnya
            showNotification(`Level up! Reached Level ${gameState.level}!`);

            playSound('levelup.wav');

            const numplantnow = parseInt(_(".market-item").length) - 3;
            const availablePlants = getAvailablePlants(gameState.level);
            if (availablePlants.length > numplantnow && numplantnow > 0) {
                setTimeout(() => {
                    showNotification(`New Plant Added!`);
                }, 2000);
            }
            populateMarket(); // Perbarui market dengan tanaman baru
        }
    }

    // Fungsi untuk membeli atau mengganti hewan
    const buyPet = async () => {
        const petItems = document.getElementById('pet-items');
        petItems.style.display = 'flex';
        petItems.innerHTML = '';
        gameState.petTypes.forEach(pet => {
            const item = document.createElement('div');
            item.className = 'pet-item';
            item.innerHTML = `
                    <div class="market-item-emoji">${pet.emoji}</div>
                    <div class="market-item-name">${pet.name}</div>
                    <div class="market-item-cost">🪙${pet.cost}</div>
                `;
            item.addEventListener('click', async () => {
                const action = gameState.pet ? 'replace' : 'buy';
                const confirmed = await showPopup(`${action === 'buy' ? 'Buy' : 'Replace pet with'} ${pet.name} ${pet.emoji} for 🪙${pet.cost}?`);
                if (confirmed) {
                    if (gameState.money >= pet.cost) {
                        if ((gameState.money - pet.cost) >= 50) {
                            gameState.money -= pet.cost;
                            gameState.pet = { id: pet.id, emoji: pet.emoji, hunger: 100 };
                            updatePetUI();
                            updateUI();
                            showNotification(`${action === 'buy' ? 'Adopted' : 'Replaced with'} ${pet.name} ${pet.emoji}!`);
                            saveGame();
                        } else {
                            showNotification(`can't buy, not good for your 🪙 health`);
                        }
                    } else {
                        showNotification(`Not enough 🪙 to ${action} ${pet.emoji}!`);
                    }
                }
            });
            petItems.appendChild(item);
        });
    };

    // Fungsi untuk memberi makan hewan
    const feedPet = async () => {
        if (!gameState.pet) {
            showNotification('No pet to feed!');
            return;
        }

        const options = [
            ...gameState.petFoods.map(food => ({
                type: 'buy',
                name: food.name,
                emoji: food.emoji,
                cost: food.cost,
                hungerValue: food.hungerValue
            })),
            ...gameState.petFeedItems.map(item => ({
                type: 'inventory',
                name: getPlantName(item.emoji),
                emoji: item.emoji,
                cost: 0,
                hungerValue: item.hungerValue,
                available: (gameState.inventory[item.emoji] || 0) > 0
            }))
        ].filter(opt => opt.type === 'buy' || opt.available);

        if (options.length === 0) {
            showNotification('No food available! Buy pet food or harvest more crops.');
            return;
        }

        const message = `
        Feed ${gameState.pet.emoji} with:<br>
            <div style="text-align:left;margin-top:10px;">
            ${options.map(opt => `
                <div class="feeditem">
                    <input type="radio" name="feed-option" value="${opt.emoji}" id="${opt.emoji}">
                    <label for="${opt.emoji}">${opt.name} ${opt.emoji} (${opt.type === 'buy' ? `🪙${opt.cost}` : 'From Inventory'})</label>
                </div>
            `).join('')}
            </div>
        `;

        const confirmed = await showPopup(message, 'Feed', true, false);
        if (confirmed) {
            const selectedOption = document.querySelector('input[name="feed-option"]:checked');
            if (!selectedOption) {
                showNotification('Please select a food option!');
                return;
            }
            const option = options.find(opt => opt.emoji === selectedOption.value);
            if (option.type === 'buy' && gameState.money < option.cost) {
                showNotification(`Not enough 🪙 to buy ${option.emoji}!`);
                return;
            }
            if (option.type === 'inventory' && !gameState.inventory[option.emoji]) {
                showNotification(`No ${option.name} in inventory!`);
                return;
            }

            if (option.type === 'buy') {
                if ((gameState.money - option.cost) >= 50) {
                    gameState.money -= option.cost;
                    _('#love-animation').classList.add('love-heart');
                    setTimeout(() => {
                        _('#love-animation').classList.remove('love-heart');
                    }, 1500);
                } else {
                    showNotification(`can't buy, not good for your 🪙 health`);
                    return;
                }
            } else {
                if ((gameState.money - option.cost) >= 50) {
                    gameState.inventory[option.emoji]--;
                    if (gameState.inventory[option.emoji] <= 0) {
                        delete gameState.inventory[option.emoji];
                    }
                } else {
                    showNotification(`can't buy, not good for your 🪙 health`);
                    return;
                }
            }

            gameState.pet.hunger = Math.min(gameState.pet.hunger + option.hungerValue, 100);
            updatePetUI();
            updateUI();
            showNotification(`Fed ${gameState.pet.emoji} with ${option.name}! Hunger: ${Math.round(gameState.pet.hunger)}`);
            saveGame();
            feedPet();
        }
    };

    // Fungsi untuk memperbarui UI hewan
    const updatePetUI = () => {
        const petEmoji = document.getElementById('pet-emoji');
        const hungerProgress = document.getElementById('hunger-progress');
        if (gameState.pet) {
            _('#pet-emoji-container').style.display = 'block';
            petEmoji.textContent = gameState.pet.emoji;
            hungerProgress.style.width = `${gameState.pet.hunger}%`;
            hungerProgress.style.backgroundColor = gameState.pet.hunger >= 20 ? '#1b83f2' : '#999';
        } else {
            _('#pet-emoji-container').style.display = 'none';
            hungerProgress.style.width = '0%';
        }
    };

    // Fungsi untuk panen otomatis
    const autoHarvest = () => {
        if (!gameState.pet || gameState.pet.hunger < 20) return;

        const readyPlotIndex = gameState.plots.findIndex((plot, index) => plot.plant && isReadyToHarvest(index));
        if (readyPlotIndex !== -1) {
            harvestPlant(readyPlotIndex, true);
            // showNotification(`${gameState.pet.emoji} harvested a plant!`);
        }
    };

    _('#feed-pet').addEventListener('click', feedPet);
    _('#pet-emoji').addEventListener('click', () => {
        if (gameState.pet) {
            _('#love-animation').classList.add('love-heart');
            setTimeout(() => {
                _('#love-animation').classList.remove('love-heart');
            }, 1500);
        }
    });

    // Save game when page is closed
    window.addEventListener('beforeunload', () => {
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
        maxPlants: 5 // Maksimum jenis tanaman di grid
    };

    // Initialize minigame
    const initMinigame = () => {
        minigameState.grid = [];
        minigameState.moves = 20;
        minigameState.score = 0;
        minigameState.selectedCell = null;
        minigameState.isProcessing = false;
        generateMinigameGrid();
        updateMinigameUI();
    };

    // Generate minigame grid
    const generateMinigameGrid = () => {
        const getavailablePlants = getAvailablePlants(gameState.level).filter(p => p.emoji !== '🟫');
        const availablePlants = getavailablePlants.reverse();
        const plantPool = availablePlants.slice(0, Math.min(minigameState.maxPlants, availablePlants.length));
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
                    (i >= 2 && minigameState.grid[i - 1][j]?.emoji === emoji && minigameState.grid[i - 2][j]?.emoji === emoji) ||
                    (j >= 2 && minigameState.grid[i][j - 1]?.emoji === emoji && minigameState.grid[i][j - 2]?.emoji === emoji)
                );

                minigameState.grid[i][j] = { emoji, matched: false };
            }
        }
    };

    // Update minigame UI
    const updateMinigameUI = () => {
        const gridElement = _('#minigame-grid');
        gridElement.innerHTML = '';
        for (let i = 0; i < minigameState.gridSize; i++) {
            for (let j = 0; j < minigameState.gridSize; j++) {
                const cell = document.createElement('div');
                cell.className = 'min-emoji minigame-cell';
                cell.dataset.row = i;
                cell.dataset.col = j;
                cell.textContent = minigameState.grid[i][j].emoji;
                if (minigameState.grid[i][j].matched) {
                    cell.classList.add('matched');
                }
                cell.addEventListener('click', () => handleMinigameCellClick(i, j));
                gridElement.appendChild(cell);
            }
        }
        _('#minigame-score').textContent = minigameState.score;
        _('#minigame-moves').textContent = minigameState.moves;
    };

    // Handle cell click
    const handleMinigameCellClick = (row, col) => {
        if (minigameState.isProcessing || minigameState.moves <= 0) return;

        const cellElement = document.querySelector(`.minigame-cell[data-row="${row}"][data-col="${col}"]`);
        if (!minigameState.selectedCell) {
            minigameState.selectedCell = { row, col };
            cellElement.classList.add('selected');
        } else {
            const { row: prevRow, col: prevCol } = minigameState.selectedCell;
            const prevCellElement = document.querySelector(`.minigame-cell[data-row="${prevRow}"][data-col="${prevCol}"]`);
            prevCellElement.classList.remove('selected');

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
        const cell1 = document.querySelector(`.minigame-cell[data-row="${row1}"][data-col="${col1}"]`);
        const cell2 = document.querySelector(`.minigame-cell[data-row="${row2}"][data-col="${col2}"]`);

        // Tentukan arah animasi berdasarkan posisi
        let class1, class2;
        if (row1 === row2) {
            // Pertukaran horizontal
            class1 = col1 < col2 ? 'swap-right' : 'swap-left';
            class2 = col1 < col2 ? 'swap-left' : 'swap-right';
        } else {
            // Pertukaran vertikal
            class1 = row1 < row2 ? 'swap-down' : 'swap-up';
            class2 = row1 < row2 ? 'swap-up' : 'swap-down';
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
                if (j < minigameState.gridSize && minigameState.grid[i][j]?.emoji === currentEmoji) {
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
                    currentEmoji = j < minigameState.gridSize ? minigameState.grid[i][j]?.emoji : null;
                }
            }
        }

        // Check columns
        for (let j = 0; j < minigameState.gridSize; j++) {
            let count = 1;
            let startRow = 0;
            let currentEmoji = minigameState.grid[0][j]?.emoji;
            for (let i = 1; i <= minigameState.gridSize; i++) {
                if (i < minigameState.gridSize && minigameState.grid[i][j]?.emoji === currentEmoji) {
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
                    currentEmoji = i < minigameState.gridSize ? minigameState.grid[i][j]?.emoji : null;
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
        matches.forEach(match => {
            match.cells.forEach(({ row, col }) => {
                minigameState.grid[row][col].matched = true;
            });
        });
        updateMinigameUI();

        // Hitung skor dan tambahkan tanaman ke inventaris
        let totalPoints = 0;
        matches.forEach(match => {
            const matchCount = match.count;
            let points = 0;
            if (matchCount === 3) points = 10;
            else if (matchCount === 4) points = 20;
            else if (matchCount >= 5) points = 30;
            totalPoints += points;

            // Tambahkan tanaman ke inventaris jika kecocokan 4 atau lebih
            if (matchCount >= 4) {
                const matchedEmoji = match.emoji;
                gameState.inventory[matchedEmoji] = (gameState.inventory[matchedEmoji] || 0) + 1;
                const plantName = getPlantName(matchedEmoji);
                showNotification(`Got 1 ${plantName} ${matchedEmoji}!`);
                updateUI();
                saveGame();
            }
        });
        minigameState.score += totalPoints;

        // Putar efek suara kecocokan
        playSound('match.wav');

        // Tunggu animasi selesai
        await new Promise(resolve => setTimeout(resolve, 500));

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
                minigameState.grid[i][j] = { emoji: '', matched: true };
            }
        }
    };

    // Fill empty slots with new plants
    const fillGrid = () => {
        const getavailablePlants = getAvailablePlants(gameState.level).filter(p => p.emoji !== '🟫');
        const availablePlants = getavailablePlants.reverse();
        const plantPool = availablePlants.slice(0, Math.min(minigameState.maxPlants, availablePlants.length));
        for (let i = 0; i < minigameState.gridSize; i++) {
            for (let j = 0; j < minigameState.gridSize; j++) {
                if (minigameState.grid[i][j].matched) {
                    minigameState.grid[i][j] = {
                        emoji: plantPool[Math.floor(Math.random() * plantPool.length)].emoji,
                        matched: false
                    };
                }
            }
        }
    };

    // Check if minigame is over
    const checkMinigameEnd = async (isDeadlock = false) => {
        if (minigameState.moves <= 0 || minigameState.score >= minigameState.targetScore || isDeadlock) {
            let message = '';
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

            await showPopup(rewardMessage, 'Result');
            _('#minigame-popup-overlay').classList.remove('show');
        }
    };

    // Open minigame
    const openMinigame = async () => {
        const levelrequire = 5;
        if (gameState.level >= levelrequire) {
            const availablePlants = getAvailablePlants(gameState.level).filter(p => p.emoji !== '🟫');
            availablePlants.sort((a, b) => b.cost - a.cost);
            const entryCost = availablePlants[0].cost * 10;
            const confirmed = await showPopup(`Play Plant Match for 🪙${entryCost}?`);
            if (confirmed) {
                if (gameState.money >= entryCost) {
                    if (gameState.money - entryCost >= 50) {
                        gameState.money -= entryCost;
                        updateUI();
                        saveGame();
                        initMinigame();
                        _('#minigame-popup-overlay').classList.add('show');
                    } else {
                        showNotification(`Can't play, not good for your 🪙 health`);
                    }
                } else {
                    showNotification(`Not enough 🪙 to play!`);
                }
            }
        } else {
            showPopup(`Plant Match can be played at level ${levelrequire}`, 'Level Requirement', false);
        }
    };

    // Event listeners for minigame
    _('#play-minigame').addEventListener('click', openMinigame);
    _('#minigame-close').addEventListener('click', async () => {
        const confirmed = await showPopup(`Close Plant Match without finishing it will not return your 🪙.<br>Are you sure to close it?`);
        if (confirmed) {
            _('#minigame-popup-overlay').classList.remove('show');
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
    const scoreElement = document.getElementById('dropcrops-score');
    const nextEmojiElement = document.getElementById('dropcrops-next');
    const gameCanvas = document.getElementById('dropcrops-canvas');

    // Danger zone
    const dangerZone = document.createElement('div');
    dangerZone.className = 'danger-zone';
    gameCanvas.appendChild(dangerZone);

    // Create engine
    const engine = Engine.create({
        gravity: { x: 0, y: 1, scale: 0.001 },
        constraintIterations: 2,
        positionIterations: 4,
        velocityIterations: 4,
        enableSleeping: true
    });

    const canvasWidth = 300;
    const canvasHeight = 350;

    // Create walls
    const walls = [
        // bottom
        Bodies.rectangle(canvasWidth / 2, canvasHeight + WALL_THICKNESS / 2 - 5, canvasWidth, WALL_THICKNESS, { isStatic: true, friction: 0, render: { visible: false } }),
        // left
        Bodies.rectangle(-WALL_THICKNESS / 2, canvasHeight / 2, WALL_THICKNESS - 10, canvasHeight, { isStatic: true, friction: 0, render: { visible: false } }),
        // right
        Bodies.rectangle(canvasWidth + WALL_THICKNESS / 2 - 5, canvasHeight / 2, WALL_THICKNESS, canvasHeight, { isStatic: true, friction: 0, render: { visible: false } })
    ];
    World.add(engine.world, walls);

    // Hidden renderer
    const render = Render.create({
        element: gameCanvas,
        engine: engine,
        options: { width: canvasWidth, height: canvasHeight, wireframes: false, background: 'transparent', visible: false }
    });

    const runner = Runner.create({ delta: 16.67 });
    Runner.run(runner, engine);

    const emojiBodies = new Map();
    let lastUpdateTime = performance.now();

    function getRandomEmojiIndex() {
        const weights = [0.4, 0.3, 0.15, 0.08, 0.05, 0.02];
        let rand = Math.random(), sum = 0;
        for (let i = 0; i < weights.length; i++) {
            sum += weights[i];
            if (rand <= sum) return i;
        }
        return 0;
    }

    function createEmoji(x, y, emojiIndex) {
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
            sleepThreshold: 60
        });

        emojiBodies.set(body, {
            emoji,
            index: emojiIndex,
            element: null,
            merged: false
        });

        World.add(engine.world, body);
        createEmojiElement(body);
        // console.log(`Created emoji: ${emoji} at (${x}, ${y}) with size ${size}`);
        return body;
    }

    function createEmojiElement(body) {
        const emojiData = emojiBodies.get(body);
        if (!emojiData) {
            console.error('No emoji data for body');
            return;
        }

        const element = document.createElement('div');
        element.className = 'emoji';
        element.textContent = emojiData.emoji;
        element.style.fontSize = `${EMOJI_SIZES[emojiData.index]}px`;
        element.style.zIndex = '20';
        gameCanvas.appendChild(element);
        emojiData.element = element;
        updateEmojiElementPosition(body);
        // console.log(`Created DOM element for emoji: ${emojiData.emoji}`);
    }

    function updateEmojiElementPosition(body) {
        const emojiData = emojiBodies.get(body);
        if (!emojiData || !emojiData.element) return;

        const element = emojiData.element;
        const size = EMOJI_SIZES[emojiData.index];
        element.style.left = `${body.position.x - size / 2}px`;
        element.style.top = `${body.position.y - size / 2}px`;
        element.style.transform = `rotate(${body.angle}rad)`;
    }

    // Create preview element
    function createPreviewElement() {
        if (previewElement) return;
        previewElement = document.createElement('div');
        previewElement.className = 'emoji-preview';
        previewElement.style.fontSize = `${EMOJI_SIZES[nextEmojiIndex]}px`;
        previewElement.style.zIndex = '25';
        previewElement.textContent = EMOJI_SEQUENCE[nextEmojiIndex];
        gameCanvas.appendChild(previewElement);
        // console.log('Created preview element');
    }

    // Update preview position
    function updatePreviewPosition(x) {
        if (!previewElement || isGameOver) return;
        const size = EMOJI_SIZES[nextEmojiIndex];
        // Batasi posisi x agar tetap di dalam canvas
        const clampedX = Math.max(size / 2, Math.min(canvasWidth - size / 2, x)) + 5;
        previewElement.style.left = `${(clampedX - size / 2) - (WALL_THICKNESS)}px`;
        previewElement.style.top = `30px`; // Tetap di tengah danger zone
        previewElement.textContent = EMOJI_SEQUENCE[nextEmojiIndex];
        previewElement.style.fontSize = `${EMOJI_SIZES[nextEmojiIndex]}px`;
    }

    // Remove preview element
    function removePreviewElement() {
        if (previewElement) {
            previewElement.remove();
            previewElement = null;
            // console.log('Removed preview element');
        }
    }

    Events.on(engine, 'collisionStart', function (event) {
        if (merging || isGameOver) return;

        const pairs = event.pairs;
        for (let pair of pairs) {
            if (pair.bodyA.label.startsWith('emoji-') && pair.bodyB.label.startsWith('emoji-')) {
                const bodyA = pair.bodyA;
                const bodyB = pair.bodyB;

                if (bodyA.isSleeping && bodyB.isSleeping) continue;

                const emojiDataA = emojiBodies.get(bodyA);
                const emojiDataB = emojiBodies.get(bodyB);

                if (emojiDataA && emojiDataB &&
                    emojiDataA.index === emojiDataB.index &&
                    !emojiDataA.merged && !emojiDataB.merged &&
                    emojiDataA.index < EMOJI_SEQUENCE.length - 1) {
                    merging = true;
                    mergeEmojis(bodyA, bodyB);
                    merging = false;
                }
            }
        }
    });

    function mergeEmojis(bodyA, bodyB) {
        const emojiDataA = emojiBodies.get(bodyA);
        const emojiDataB = emojiBodies.get(bodyB);

        if (!emojiDataA || !emojiDataB || emojiDataA.merged || emojiDataB.merged) return;

        const mergeX = (bodyA.position.x + bodyB.position.x) / 2;
        const mergeY = (bodyA.position.y + bodyB.position.y) / 2;

        removeEmoji(bodyA);
        removeEmoji(bodyB);

        const newEmojiIndex = emojiDataA.index + 1;
        const newBody = createEmoji(mergeX, mergeY, newEmojiIndex);

        playSound('match.wav');
        if (newEmojiIndex === EMOJI_SEQUENCE.length - 1) {
            gameOver(true);
            return;
        }

        score += (newEmojiIndex + 1) * 10;
        scoreElement.textContent = score;

        if (newBody) {
            Body.applyForce(newBody, newBody.position, { x: (Math.random() - 0.5) * 0.01, y: -0.02 });
        }
    }

    function removeEmoji(body) {
        const emojiData = emojiBodies.get(body);
        if (!emojiData) return;

        emojiData.merged = true;
        if (emojiData.element) {
            emojiData.element.remove();
            // console.log(`Removed emoji: ${emojiData.emoji}`);
        }
        World.remove(engine.world, body);
        emojiBodies.delete(body);
    }

    function updateNextEmoji() {
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
    }

    function spawnEmoji(x) {
        if (!gameStarted) {
            return;
        }
        if (!canSpawn || isGameOver) {
            // console.log('Cannot spawn: canSpawn=', canSpawn, 'isGameOver=', isGameOver);
            return;
        }

        canSpawn = false;
        setTimeout(() => canSpawn = true, 500);

        // console.log(`Spawning emoji at x=${x}`);
        removePreviewElement(); // Hapus preview sebelum spawn
        createEmoji(x, 50, nextEmojiIndex);
        updateNextEmoji();
        createPreviewElement(); // Buat preview baru setelah spawn
    }

    // Event handlers untuk preview
    gameCanvas.addEventListener('mousemove', function (e) {
        if (isGameOver || !canSpawn) return;
        const rect = gameCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        if (!previewElement) createPreviewElement();
        lastPositionX = x;
        updatePreviewPosition(x);
    });

    gameCanvas.addEventListener('touchmove', function (e) {
        if (isGameOver || !canSpawn) return;
        e.preventDefault();
        const rect = gameCanvas.getBoundingClientRect();
        const x = e.touches[0].clientX - rect.left;
        if (!previewElement) createPreviewElement();
        lastPositionX = x;
        updatePreviewPosition(x);
    });

    gameCanvas.addEventListener('click', function (e) {
        if (!canSpawn || isGameOver) return;
        const rect = gameCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        // console.log(`Click at x=${x}`);
        spawnEmoji(x);
    });

    gameCanvas.addEventListener('touchstart', function (e) {
        if (!canSpawn || isGameOver) return;
        e.preventDefault();
        const rect = gameCanvas.getBoundingClientRect();
        const x = e.touches[0].clientX - rect.left;
        lastPositionX = x;
    });

    gameCanvas.addEventListener('touchend', function (e) {
        if (!canSpawn || isGameOver) return;
        e.preventDefault();
        spawnEmoji(lastPositionX);
    });


    function gameLoop(timestamp) {
        if (isGameOver) return;

        if (timestamp - lastUpdateTime >= UPDATE_INTERVAL) {
            let dangerZoneActive = false;
            emojiBodies.forEach((data, body) => {
                if (body.isSleeping) return;

                updateEmojiElementPosition(body);

                if (body.position.y < (DANGER_ZONE_Y + 15) && body.speed < 0.1) {
                    // console.log('Game over triggered: emoji in danger zone');
                    gameOver();
                    return;
                }
                if (body.position.y < DANGER_ZONE_Y) {
                    dangerZoneActive = true;
                }

                if (body.position.y > canvasHeight + 100 || body.position.x < -100 || body.position.x > canvasWidth + 100) {
                    removeEmoji(body);
                }
            });

            lastUpdateTime = timestamp;
        }

        requestAnimationFrame(gameLoop);
    }

    function startGame() {
        const dropcropsgrid = document.getElementById('dropcrops-container');
        const gameOverDiv = document.createElement('div');
        gameOverDiv.className = 'game-over';
        gameOverDiv.style.display = 'flex';
        gameOverDiv.innerHTML = `
        <button class="restart-btn" id="startgame">Start Game</button>
    `;
        dropcropsgrid.appendChild(gameOverDiv);

        gameOverDiv.querySelector('#startgame').addEventListener('click', function () {
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
    }

    function gameOver(finish = false) {
        if (isGameOver) return;
        isGameOver = true;
        gameStarted = false;
        removePreviewElement(); // Hapus preview saat game over

        const dropcropsgrid = document.getElementById('dropcrops-container');
        const gameOverDiv = document.createElement('div');
        gameOverDiv.className = 'game-over';
        gameOverDiv.style.display = 'flex';
        if (finish) {
            gameState.points += 5;
            if (gameState.pet) {
                gameState.pet.hunger = Math.min(gameState.pet.hunger + 50, 100);
                showNotification(`Fed ${gameState.pet.emoji} with ${option.name}! Hunger: ${Math.round(gameState.pet.hunger)}`);
                updatePetUI();
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

        gameOverDiv.querySelector('.restart-btn').addEventListener('click', function () {
            emojiBodies.forEach((data, body) => removeEmoji(body));
            emojiBodies.clear();
            dropcropsgrid.removeChild(gameOverDiv);
            score = 0;
            scoreElement.textContent = '0';
            _('#dropcrops-popup-overlay').classList.remove('show');
        });
    }

    const initDropCrop = () => {
        updateNextEmoji();
        createPreviewElement(); // Buat preview saat inisialisasi
        requestAnimationFrame(gameLoop);
        startGame();
    }

    const openDropCrops = async () => {
        const levelrequire = 10, maxlvl = 9;
        if (gameState.level >= levelrequire) {
            const availablePlants = getAvailablePlants(gameState.level).filter(p => p.emoji !== '🟫');
            let newsort = [...availablePlants].map(p => p.emoji);
            newsort.reverse();
            newsort = newsort.slice(0, Math.min(maxlvl, newsort.length));
            availablePlants.sort((a, b) => b.cost - a.cost);
            const entryCost = availablePlants[0].cost * 10;
            const confirmed = await showPopup(`Play Drop Crops for 🪙${entryCost}?`);
            if (confirmed) {
                newsort.reverse();
                _("#dropcrops-info").innerHTML = newsort.toString().replace(/,/g, ' > ');
                if (gameState.money >= entryCost) {
                    if (gameState.money - entryCost >= 50) {
                        EMOJI_SEQUENCE = newsort;
                        gameState.money -= entryCost;
                        updateUI();
                        saveGame();
                        initDropCrop();
                        _('#dropcrops-popup-overlay').classList.add('show');
                    } else {
                        showNotification(`Can't play, not good for your 🪙 health`);
                    }
                } else {
                    showNotification(`Not enough 🪙 to play!`);
                }
            }
        } else {
            showPopup(`Plant Match can be played at level ${levelrequire}`, 'Level Requirement', false);
        }
    }

    // Event listeners for dropcrops
    _('#play-dropcrops').addEventListener('click', openDropCrops);
    _('#dropcrops-close').addEventListener('click', async () => {
        const confirmed = await showPopup(`Close Drop Crops without finishing it will not return your 🪙.<br>Are you sure to close it?`);
        if (confirmed) {
            _('#dropcrops-popup-overlay').classList.remove('show');
        }
    });
    // ==========================================================================
    // ==========================================================================

    // Initialize the game
    initGame();
})();