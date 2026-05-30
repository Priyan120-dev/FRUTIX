/* ==========================================================================
   FRUTIX Pinned Layout & Mango Finale Interactions
   ========================================================================= */

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Flavor Data Configuration
const flavorData = [
    {
        name: "strawberry",
        color: "#ff2a5f",
        rgb: "255, 42, 95",
        gradient: "linear-gradient(135deg, #ff2a5f, #ff7e40)",
        glow: "rgba(255, 42, 95, 0.18)"
    },
    {
        name: "mango",
        color: "#ffa200",
        rgb: "255, 162, 0",
        gradient: "linear-gradient(135deg, #ffa200, #ff5f00)",
        glow: "rgba(255, 162, 0, 0.18)"
    },
    {
        name: "pineapple",
        color: "#ffe100",
        rgb: "255, 225, 0",
        gradient: "linear-gradient(135deg, #ffd000, #88c000)",
        glow: "rgba(255, 225, 0, 0.18)"
    },
    {
        name: "watermelon",
        color: "#ff3b5c",
        rgb: "255, 59, 92",
        gradient: "linear-gradient(135deg, #ff3b5c, #20c070)",
        glow: "rgba(255, 59, 92, 0.18)"
    },
    {
        name: "orange",
        color: "#ff6f00",
        rgb: "255, 111, 0",
        gradient: "linear-gradient(135deg, #ff7b00, #ffb700)",
        glow: "rgba(255, 111, 0, 0.18)"
    },
    {
        name: "grape",
        color: "#7b1fa2",
        rgb: "123, 31, 162",
        gradient: "linear-gradient(135deg, #6a1b9a, #ba68c8)",
        glow: "rgba(123, 31, 162, 0.18)"
    }
];

document.addEventListener("DOMContentLoaded", () => {
    // --- DOM Elements ---
    const header = document.getElementById("main-header");
    const mobileToggle = document.getElementById("mobile-toggle");
    const navMenu = document.getElementById("nav-menu");
    const navLinks = document.querySelectorAll(".nav-link");
    const trackerProgress = document.getElementById("tracker-progress");
    const trackerCurrent = document.querySelector(".tracker-current");
    const flavorCards = document.querySelectorAll(".flavor-card");
    const assetLayers = document.querySelectorAll(".flavor-asset-layer");
    const tabBtns = document.querySelectorAll(".tab-btn");
    const cartonTilt = document.getElementById("carton-tilt");
    const floatingContainer = document.getElementById("floating-items");

    let currentFlavorIndex = 0;

    // --- 1. Sticky Navigation Blur ---
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });

    // --- 2. Mobile Menu Menu ---
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener("click", () => {
            navMenu.classList.toggle("open");
            mobileToggle.classList.toggle("active");
            
            // Hamburger icon animation
            const bars = mobileToggle.querySelectorAll(".bar");
            if (navMenu.classList.contains("open")) {
                bars[0].style.transform = "rotate(45deg) translate(6px, 5px)";
                bars[1].style.opacity = "0";
                bars[2].style.transform = "rotate(-45deg) translate(6px, -5px)";
            } else {
                bars[0].style.transform = "none";
                bars[1].style.opacity = "1";
                bars[2].style.transform = "none";
            }
        });

        // Close menu when clicking link
        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                navMenu.classList.remove("open");
                mobileToggle.classList.remove("active");
                const bars = mobileToggle.querySelectorAll(".bar");
                bars[0].style.transform = "none";
                bars[1].style.opacity = "1";
                bars[2].style.transform = "none";
            });
        });
    }

    // --- 3. Dynamic Particle Generators ---
    const bubbleCount = 15;
    const leafCount = 10;

    for (let i = 0; i < bubbleCount; i++) {
        spawnBubble(true);
    }
    for (let i = 0; i < leafCount; i++) {
        spawnLeaf(true);
    }

    // Interval to keep spawning
    setInterval(() => spawnBubble(false), 3000);
    setInterval(() => spawnLeaf(false), 5000);

    function spawnBubble(isInit = false) {
        if (!floatingContainer) return;
        const bubble = document.createElement("div");
        bubble.classList.add("floating-bubble");
        
        const size = Math.random() * 15 + 8;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.left = `${Math.random() * 85 + 5}%`;
        
        const duration = Math.random() * 6 + 6;
        bubble.style.animationDuration = `${duration}s`;
        
        if (isInit) {
            bubble.style.animationDelay = `${Math.random() * -duration}s`;
        }
        
        floatingContainer.appendChild(bubble);
        
        setTimeout(() => {
            bubble.remove();
        }, duration * 1000);
    }

    function spawnLeaf(isInit = false) {
        if (!floatingContainer) return;
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("class", "floating-leaf");
        
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "M12,2C12,2 6,7 6,12C6,17 12,21 12,21C12,21 18,17 18,12C18,7 12,2 12,2Z");
        svg.appendChild(path);
        
        const size = Math.random() * 20 + 12;
        svg.style.width = `${size}px`;
        svg.style.height = `${size}px`;
        svg.style.left = `${Math.random() * 85 + 5}%`;
        
        const duration = Math.random() * 8 + 8;
        svg.style.animationDuration = `${duration}s`;
        
        if (isInit) {
            svg.style.animationDelay = `${Math.random() * -duration}s`;
        }
        
        floatingContainer.appendChild(svg);
        
        setTimeout(() => {
            svg.remove();
        }, duration * 1000);
    }

    // --- 4. Interactive 3D Mouse Tilt on Carton ---
    if (cartonTilt) {
        cartonTilt.addEventListener("mousemove", (e) => {
            const rect = cartonTilt.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -12;
            const rotateY = ((x - centerX) / centerX) * 12;
            
            cartonTilt.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });
        
        cartonTilt.addEventListener("mouseleave", () => {
            cartonTilt.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
        });
    }

    // --- 5. GSAP ScrollTrigger Pinned Showcase Panel Engine ---
    let isTransitioning = false;

    const showcasePin = ScrollTrigger.create({
        trigger: "#showcase",
        start: "top top",
        end: "+=500%",
        pin: ".showcase-pinned",
        scrub: 0.5,
        onUpdate: (self) => {
            const progress = self.progress;
            const index = Math.min(Math.floor(progress * 6), 5);
            
            const percentWidth = 16.66 + (progress * 83.34);
            if (trackerProgress) trackerProgress.style.width = `${percentWidth}%`;

            if (index !== currentFlavorIndex && !isTransitioning) {
                switchFlavor(index);
            }
        }
    });

    // Switch Flavor Logic
    function switchFlavor(index) {
        isTransitioning = true;

        // 1. Deactivate current active card and layer
        flavorCards[currentFlavorIndex].classList.remove("active");
        assetLayers[currentFlavorIndex].classList.remove("active");
        tabBtns[currentFlavorIndex].classList.remove("active");

        // 2. Activate new card, layer, and tab
        flavorCards[index].classList.add("active");
        assetLayers[index].classList.add("active");
        tabBtns[index].classList.add("active");

        // 3. Update current index and label
        if (trackerCurrent) trackerCurrent.textContent = `0${index + 1}`;
        currentFlavorIndex = index;

        // 4. Update CSS Theme Custom Properties smoothly via GSAP
        const flavor = flavorData[index];
        
        gsap.to(":root", {
            "--theme-color": flavor.color,
            "--theme-color-rgb": flavor.rgb,
            "--theme-glow": flavor.glow,
            duration: 0.7,
            ease: "power2.out",
            onComplete: () => {
                isTransitioning = false;
            }
        });
        
        document.documentElement.style.setProperty("--theme-gradient", flavor.gradient);

        const visualGlow = document.getElementById("visual-glow");
        if (visualGlow) {
            visualGlow.style.transform = "scale(1.3)";
            setTimeout(() => {
                visualGlow.style.transform = "scale(1)";
            }, 500);
        }
    }

    // --- 6. Click Tabs Scroll Navigation ---
    tabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const targetIndex = parseInt(btn.getAttribute("data-target"));
            if (targetIndex === currentFlavorIndex) return;

            const totalScrollableDist = showcasePin.end - showcasePin.start;
            const targetProgress = targetIndex / 5.0;
            const targetScrollTop = showcasePin.start + (totalScrollableDist * targetProgress);

            window.scrollTo({
                top: targetScrollTop,
                behavior: "smooth"
            });
        });
    });

    // --- 7. Interactive Scroll down Button (Hero) ---
    const scrollIndicator = document.getElementById("scroll-indicator");
    if (scrollIndicator) {
        scrollIndicator.addEventListener("click", () => {
            const showcaseSection = document.getElementById("showcase");
            if (showcaseSection) {
                showcaseSection.scrollIntoView({ behavior: "smooth" });
            }
        });
    }

    // --- 8. Reveal Animations (Intro) ---
    gsap.from(".animate-reveal", {
        opacity: 0,
        y: 40,
        stagger: 0.2,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.3
    });

    // --- 9. Our Story Background Video Autoplay Control ---
    const storyVideo = document.getElementById("video-story-bg");
    if (storyVideo) {
        ScrollTrigger.create({
            trigger: "#story",
            start: "top 80%",
            end: "bottom 20%",
            onEnter: () => {
                storyVideo.play().catch(err => console.log("Story background video play blocked:", err));
            },
            onEnterBack: () => {
                storyVideo.play().catch(err => console.log("Story background video play blocked:", err));
            },
            onLeave: () => {
                storyVideo.pause();
            },
            onLeaveBack: () => {
                storyVideo.pause();
            }
        });
    }

    // Subtle cursor glow tracking
    const cursorGlow = document.createElement("div");
    cursorGlow.style.position = "fixed";
    cursorGlow.style.width = "400px";
    cursorGlow.style.height = "400px";
    cursorGlow.style.borderRadius = "50%";
    cursorGlow.style.background = "radial-gradient(circle, rgba(var(--theme-color-rgb), 0.05) 0%, rgba(8,9,11,0) 70%)";
    cursorGlow.style.pointerEvents = "none";
    cursorGlow.style.zIndex = "1";
    cursorGlow.style.transform = "translate(-50%, -50%)";
    cursorGlow.style.transition = "background 0.8s ease";
    document.body.appendChild(cursorGlow);

    window.addEventListener("mousemove", (e) => {
        gsap.to(cursorGlow, {
            left: e.clientX,
            top: e.clientY,
            duration: 0.8,
            ease: "power2.out"
        });
    });

    setInterval(() => {
        const rgb = getComputedStyle(document.documentElement).getPropertyValue('--theme-color-rgb');
        cursorGlow.style.background = `radial-gradient(circle, rgba(${rgb}, 0.05) 0%, rgba(8,9,11,0) 70%)`;
    }, 500);
});