(function () {
    // Game state
    const gameState = {
        money: 100,
        time: 0,
        dayDuration: 60, // seconds per in-game day
        realTimeScale: 60, // 1 real second = 60 game seconds (1:60 ratio)
        lastPlayed: null,
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
        music: true
    };

    const _ = (id) => {
        let el = {};
        if (id.substr(0, 1) == "#") {
            el = document.getElementById(id.substr(1, id.length));
        } else if (id.substr(0, 1) == ".") {
            el = document.querySelectorAll(id);
        } else if (id.substr(0, 1) == "@") {
            el = document.getElementsByName(id.substr(1, id.length));
        }
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
    const cancelmarket = _('#cancelmarket');
    const levelDisplay = _('#level');
    const pointsProgress = _('#points-progress');
    const pointsText = _('#points-text');
    const questContent = _('#quest-content');
    const setting = _('#setting');

    const popupOverlay = _('#popup-overlay');
    const popupTitle = _('#popup-title');
    const popupMessage = _('#popup-message');
    const popupConfirm = _('#popup-confirm');
    const popupCancel = _('#popup-cancel');

    // Initialize the game
    const initGame = () => {
        loadGame();
        createFarmPlots();
        populateMarket();
        updatePetUI();
        updateUI();
        startGameLoop();
        updateLastPlayedDisplay();
        generateQuests();
    }

    const music = _("#background-audio");
    music.volume = 0.5; // Atur volume (0.1 - 1)
    document.addEventListener("click", function () {
        if (gameState.music) {
            music.play().catch(e => {
                console.log("Autoplay blocked, but user clicked!");
            });
        }
    });

    // Dapatkan tanaman yang tersedia di market berdasarkan level
    const getAvailablePlants = (level) => {
        // Pada Level 1, hanya Wheat dan Corn
        const basePlants = gameState.plantTypes.slice(0, 2); // 🌾, 🌽
        // Tambah 1 tanaman per level setelah Level 1
        const additionalPlants = level > 1 ? gameState.plantTypes.slice(2, 2 + (level - 1)) : [];
        // Selalu sertakan Land
        const landPlant = gameState.plotCount < 12 ? gameState.plantTypes.find(p => p.emoji === '🟫') : [];
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
                _('#pet-items').style.display = 'none';
                document.querySelectorAll('.market-item').forEach(i => i.classList.remove('selected'));
                cancelmarket.style.display = "block";
                if (plant.emoji == "🟫") {
                    cancelmarket.style.display = "none";
                    let confirmed = await showPopup('<span style="font-size:20px;">Buy Land 🟫?</span>');
                    if (confirmed) {
                        const seedCost = getPlantCost(plant.emoji);
                        if (gameState.money >= seedCost) {
                            if ((gameState.money - seedCost) >= 50) {
                                gameState.money -= seedCost;
                                gameState.plotCount++;
                                gameState.plantTypes.find(p => p.emoji === '🟫').cost = gameState.plantTypes.find(p => p.emoji === '🟫').cost + 100;
                                updateUI();
                                createFarmPlots();
                                populateMarket();
                                showNotification(`New Land 🟫 Added!`);
                            } else {
                                showNotification(`can't buy, remaining 🪙 must be at least 50`);
                            }
                        } else {
                            showNotification(`Not enough 🪙 to buy Land!`);
                        }
                    }
                } else {
                    // Add selected class to clicked item
                    item.classList.add('selected');
                    gameState.selectedSeed = plant.emoji;
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
            progressContainer.appendChild(progressBar);
            plot.appendChild(plant);
            plot.appendChild(progressContainer);

            plot.addEventListener('click', () => handlePlotClick(i));
            farmGrid.appendChild(plot);
        }
    }

    // Handle plot click
    const handlePlotClick = (index) => {
        const plot = gameState.plots[index];

        if (!plot.plant) {
            // Plant a seed if empty and seed is selected
            if (gameState.selectedSeed) {
                const seedCost = getPlantCost(gameState.selectedSeed);

                if (gameState.money >= seedCost) {
                    plot.plant = gameState.selectedSeed;
                    plot.growth = 0;
                    plot.plantedAt = new Date().toISOString();
                    gameState.money -= seedCost;
                    updatePlotUI(index);
                    updateUI();
                    // showNotification(`Planted ${getPlantName(gameState.selectedSeed)} for 🪙${seedCost}!`);
                    gameState.selectedSeed = null;
                    // Reset selected item in market
                    document.querySelectorAll('.market-item').forEach(i => i.classList.remove('selected'));
                    cancelmarket.style.display = "none";
                    saveGame();
                } else {
                    showNotification(`Not enough 🪙 to buy ${gameState.selectedSeed}!`);
                    // Reset selected item in market
                    document.querySelectorAll('.market-item').forEach(i => i.classList.remove('selected'));
                    cancelmarket.style.display = "none";
                }
            }
        } else if (isReadyToHarvest(index)) {
            // Harvest if ready
            harvestPlant(index);
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
                gameState.pet.hunger = Math.max(gameState.pet.hunger - (10 / (gameState.dayDuration / 0.1)), 0);
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
                                gameState.money = gameState.money > 999999 ? 999999 : gameState.money;
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
                if (!parsed.points) {
                    parsed.points = 0;
                }

                if (parsed.plotCount > 12) {
                    parsed.plotCount = 12;
                }

                if (!parsed.pet) {
                    parsed.pet = null;
                }

                // Ensure each plot has plantedAt property
                parsed.plots.forEach(plot => {
                    if (!plot.plantedAt && plot.plant) {
                        plot.plantedAt = new Date().toISOString();
                    }
                });

                const plantTypes = gameState.plantTypes;
                plantTypes.find(p => p.emoji === '🟫').cost = parsed.plantTypes.find(p => p.emoji === '🟫').cost;

                Object.assign(gameState, parsed);
                gameState.plantTypes = plantTypes;

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

    cancelmarket.addEventListener('click', async () => {
        gameState.selectedSeed = null;
        document.querySelectorAll('.market-item').forEach(i => i.classList.remove('selected'));
        cancelmarket.style.display = "none";
    });

    let reset = false;
    setting.addEventListener('click', async () => {
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
        `, 'Setting', false);

        _('#btnmusic').addEventListener('click', () => {
            gameState.music = _('#btnmusic').checked;
            if (!_('#btnmusic').checked) {
                music.pause();
            }
        });

        _('#resetgame').addEventListener('click', async () => {
            const confirmed = await showPopup(`
                Are you sure you want to reset the game? This will erase all progress.<br>
                Type reset "reset" to confirm. <input type="text" id="reset-input" style="width:100px;margin:10px;padding:5px 8px;border-radius:5px;border:2px solid #2E8B57;outline:none;" autocomplete="off">
            `);
            if (confirmed) {
                const resetinput = _('#reset-input').value;
                if (resetinput == "reset") {
                    clearInterval(gameState.gameInterval);
                    localStorage.removeItem('emojiFarm');
                    reset = true;
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
        if (gameState.level >= 6) {
            startIndex = gameState.level % 2 === 0 ? gameState.level - 10 : gameState.level - 11;
            if (gameState.level > 40) {
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

            // Tambah poin dan uang
            gameState.points += 2; // 2 poin per quest
            const plantValue = getPlantValue(plantEmoji);
            const reward = (plantValue * quantity);// + (gameState.level * 10);
            gameState.money += reward;
            gameState.money = gameState.money > 999999 ? 999999 : gameState.money;

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
            showNotification(`Not enough ${getPlantName(plantEmoji)}! Need ${quantity}, have ${inventoryCount}.`);
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
                <div class="quest-npc">${npc}</div>
                <div class="quest-details">
                    ${quantity} ${plantEmoji} ${getPlantName(plantEmoji)}
                </div>
                <button class="quest-button" ${isCompletable ? '' : 'disabled'}><span class="check-icon"></span></button>
            `;

            const completeButton = questItem.querySelector('.quest-button');
            completeButton.addEventListener('click', () => completeQuest(index));

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

            const availablePlants = getAvailablePlants(gameState.level);
            const numplantnow = _(".market-item").length;
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
        if (petItems.style.display == 'none') {
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
                                petItems.style.display = 'none';
                                updatePetUI();
                                updateUI();
                                showNotification(`${action === 'buy' ? 'Adopted' : 'Replaced with'} ${pet.name} ${pet.emoji}!`);
                                saveGame();
                            } else {
                                showNotification(`can't buy, remaining 🪙 must be at least 50`);
                            }
                        } else {
                            showNotification(`Not enough 🪙 to ${action} ${pet.emoji}!`);
                        }
                    }
                });
                petItems.appendChild(item);
            });
        } else {
            petItems.innerHTML = '';
            petItems.style.display = 'none';
        }
    };

    // Fungsi untuk memberi makan hewan
    const feedPet = async () => {
        _('#pet-items').style.display = 'none';
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
                } else {
                    showNotification(`can't buy, remaining 🪙 must be at least 50`);
                    return;
                }
            } else {
                if ((gameState.money - option.cost) >= 50) {
                    gameState.inventory[option.emoji]--;
                    if (gameState.inventory[option.emoji] <= 0) {
                        delete gameState.inventory[option.emoji];
                    }
                } else {
                    showNotification(`can't buy, remaining 🪙 must be at least 50`);
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
            petEmoji.textContent = gameState.pet.emoji;
            hungerProgress.style.width = `${gameState.pet.hunger}%`;
            hungerProgress.style.backgroundColor = gameState.pet.hunger >= 20 ? '#1b83f2' : '#999';
        } else {
            petEmoji.innerHTML = '<div style="height:12px;"></div><span style="font-size:2rem;position:absolute;top:-14px;transform: rotate(-90deg);">🐾</span>';
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

    _('#buy-pet').addEventListener('click', buyPet);
    _('#feed-pet').addEventListener('click', feedPet);
    _('#pet-emoji').addEventListener('click', () => {
        _('#pet-items').style.display = 'none';
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

    const numberFormat = (number) => {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

    // Initialize the game
    initGame();
})();