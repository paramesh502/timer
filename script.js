document.addEventListener('DOMContentLoaded', () => {
    const minutesDisplay = document.getElementById('minutes');
    const secondsDisplay = document.getElementById('seconds');
    const startButton = document.getElementById('start');
    const pauseButton = document.getElementById('pause');
    const resetButton = document.getElementById('reset');
    const fullscreenButton = document.getElementById('fullscreen');
    const container = document.getElementById('container');
    const timerElement = document.getElementById('timer');
    const timerButtons = document.querySelectorAll('.timer-btn');
    const customMinutesInput = document.getElementById('custom-minutes');
    const setCustomButton = document.getElementById('set-custom');
    const bgColorPicker = document.getElementById('bg-color');

    // Handle background color change
    bgColorPicker.addEventListener('input', (e) => {
        const color = e.target.value;
        document.body.style.background = color;
        container.style.background = color;
        // Store the color in localStorage to persist it
        localStorage.setItem('bgColor', color);
    });

    // Load saved background color on page load
    const savedColor = localStorage.getItem('bgColor');
    if (savedColor) {
        document.body.style.background = savedColor;
        container.style.background = savedColor;
        bgColorPicker.value = savedColor;
    }

    let timeLeft;
    let totalTime;
    let timerId = null;
    let isFullscreen = false;

    // Initialize with default time (25 minutes)
    setTime(25);

    function setTime(minutes) {
        timeLeft = minutes * 60;
        totalTime = timeLeft;
        updateDisplay();
        updateProgress();
    }

    function updateDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        minutesDisplay.textContent = String(minutes).padStart(2, '0');
        secondsDisplay.textContent = String(seconds).padStart(2, '0');
    }

    function updateProgress() {
        const progress = timeLeft / totalTime;
        container.style.setProperty('--progress', progress);
    }

    function startTimer() {
        if (timerId === null) {
            timerId = setInterval(() => {
                if (timeLeft > 0) {
                    timeLeft--;
                    updateDisplay();
                    updateProgress();
                } else {
                    clearInterval(timerId);
                    timerId = null;
                    startButton.classList.remove('hidden');
                    pauseButton.classList.add('hidden');
                }
            }, 1000);
            startButton.classList.add('hidden');
            pauseButton.classList.remove('hidden');
        }
    }

    function pauseTimer() {
        if (timerId !== null) {
            clearInterval(timerId);
            timerId = null;
            startButton.classList.remove('hidden');
            pauseButton.classList.add('hidden');
        }
    }

    function resetTimer() {
        pauseTimer();
        setTime(totalTime / 60);
        timerElement.classList.add('animate');
        setTimeout(() => timerElement.classList.remove('animate'), 300);
    }

    function toggleFullscreen() {
        if (!isFullscreen) {
            if (container.requestFullscreen) {
                container.requestFullscreen();
            } else if (container.webkitRequestFullscreen) {
                container.webkitRequestFullscreen();
            } else if (container.msRequestFullscreen) {
                container.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    }

    // Event Listeners
    startButton.addEventListener('click', startTimer);
    pauseButton.addEventListener('click', pauseTimer);
    resetButton.addEventListener('click', resetTimer);
    fullscreenButton.addEventListener('click', toggleFullscreen);

    timerButtons.forEach(button => {
        button.addEventListener('click', () => {
            timerButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const minutes = parseInt(button.dataset.time);
            setTime(minutes);
        });
    });

    setCustomButton.addEventListener('click', () => {
        const minutes = parseInt(customMinutesInput.value);
        if (minutes && minutes > 0 && minutes <= 60) {
            setTime(minutes);
            timerButtons.forEach(btn => btn.classList.remove('active'));
        }
    });

    // Handle fullscreen changes
    document.addEventListener('fullscreenchange', () => {
        isFullscreen = !!document.fullscreenElement;
        container.classList.toggle('fullscreen', isFullscreen);
        if (isFullscreen) {
            const currentColor = bgColorPicker.value;
            document.body.style.background = currentColor;
        }
    });

    document.addEventListener('webkitfullscreenchange', () => {
        isFullscreen = !!document.webkitFullscreenElement;
        container.classList.toggle('fullscreen', isFullscreen);
        if (isFullscreen) {
            const currentColor = bgColorPicker.value;
            document.body.style.background = currentColor;
        }
    });

    document.addEventListener('msfullscreenchange', () => {
        isFullscreen = !!document.msFullscreenElement;
        container.classList.toggle('fullscreen', isFullscreen);
        if (isFullscreen) {
            const currentColor = bgColorPicker.value;
            document.body.style.background = currentColor;
        }
    });

    // Handle keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            if (timerId === null) {
                startTimer();
            } else {
                pauseTimer();
            }
        } else if (e.code === 'KeyR') {
            resetTimer();
        } else if (e.code === 'KeyF') {
            toggleFullscreen();
        }
    });
});
