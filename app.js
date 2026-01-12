/**
 * Terminal Portfolio - JavaScript
 * Handles animations, interactions, and dynamic functionality
 */

// ========================================
// Configuration
// ========================================
const CONFIG = {
    typingSpeed: 80,
    typingDelay: 500,
    commands: ["./run_portfolio.sh", "whoami", "cat about.txt", "ls -la ./skills/"],
    autoScrollDelay: 3000,
    autoScrollSpeed: 1,
    autoScrollIdleTime: 2000,
    particleCount: 30,
}

// ========================================
// DOM Elements
// ========================================
const elements = {
    typedOutput: document.getElementById("typed-output"),
    heroOutput: document.getElementById("hero-output"),
    menuToggle: document.querySelector(".menu-toggle"),
    navMobile: document.querySelector(".nav-mobile"),
    navLinks: document.querySelectorAll(".nav-link"),
    contactForm: document.getElementById("contact-form"),
    formResponse: document.getElementById("form-response"),
    terminalContent: document.getElementById("terminal-content"),
    scrollIndicator: document.getElementById("scroll-indicator"),
    scrollTopBtn: document.getElementById("scroll-top"),
    particleContainer: document.getElementById("particles"),
    matrixCanvas: document.getElementById("matrix-canvas"),
}

// ========================================
// Auto-Scroll System
// ========================================
class AutoScroller {
    constructor(container, indicator) {
        this.container = container
        this.indicator = indicator
        this.isAutoScrolling = false
        this.isPaused = false
        this.scrollSpeed = CONFIG.autoScrollSpeed
        this.idleTimer = null
        this.lastMouseMove = Date.now()
        this.animationFrame = null

        this.init()
    }

    init() {
        // Check for reduced motion
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            return
        }

        // Start auto-scroll after delay
        setTimeout(() => {
            this.startAutoScroll()
        }, CONFIG.autoScrollDelay)

        // Pause on user interaction
        this.container.addEventListener("mouseenter", () => this.pause())
        this.container.addEventListener("mouseleave", () => this.scheduleResume())
        this.container.addEventListener("touchstart", () => this.pause())
        this.container.addEventListener("wheel", () => this.pause())
        this.container.addEventListener("scroll", () => {
            if (!this.isAutoScrolling) {
                this.pause()
            }
        })

        // Track mouse movement
        document.addEventListener("mousemove", () => {
            this.lastMouseMove = Date.now()
            this.pause()
            this.scheduleResume()
        })

        // Resume when mouse is idle
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                this.toggleAutoScroll()
            }
        })
    }

    startAutoScroll() {
        if (this.isPaused) return

        this.isAutoScrolling = true
        this.indicator.classList.add("active")

        const scroll = () => {
            if (!this.isAutoScrolling || this.isPaused) return

            const maxScroll = this.container.scrollHeight - this.container.clientHeight
            const currentScroll = this.container.scrollTop

            if (currentScroll < maxScroll) {
                this.container.scrollTop += this.scrollSpeed
                this.animationFrame = requestAnimationFrame(scroll)
            } else {
                // Reset to top and continue
                setTimeout(() => {
                    this.container.scrollTop = 0
                    this.animationFrame = requestAnimationFrame(scroll)
                }, 2000)
            }
        }

        this.animationFrame = requestAnimationFrame(scroll)
    }

    pause() {
        this.isPaused = true
        this.isAutoScrolling = false
        this.indicator.classList.remove("active")

        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame)
        }
    }

    scheduleResume() {
        clearTimeout(this.idleTimer)

        this.idleTimer = setTimeout(() => {
            const timeSinceLastMove = Date.now() - this.lastMouseMove

            if (timeSinceLastMove >= CONFIG.autoScrollIdleTime) {
                this.isPaused = false
                this.startAutoScroll()
            }
        }, CONFIG.autoScrollIdleTime)
    }

    toggleAutoScroll() {
        if (this.isAutoScrolling) {
            this.pause()
        } else {
            this.isPaused = false
            this.startAutoScroll()
        }
    }
}

// ========================================
// Matrix Rain Effect
// ========================================
class MatrixRain {
    constructor(canvas) {
        this.canvas = canvas
        this.ctx = canvas.getContext("2d")
        this.columns = []
        this.fontSize = 14
        this.chars =
            "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789"

        this.init()
    }

    init() {
        // Check for reduced motion
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            return
        }

        this.resize()
        window.addEventListener("resize", () => this.resize())
        this.animate()
    }

    resize() {
        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight

        const columnCount = Math.floor(this.canvas.width / this.fontSize)
        this.columns = []

        for (let i = 0; i < columnCount; i++) {
            this.columns[i] = Math.random() * this.canvas.height
        }
    }

    draw() {
        this.ctx.fillStyle = "rgba(11, 11, 15, 0.05)"
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

        this.ctx.fillStyle = "#ff4fd8"
        this.ctx.font = `${this.fontSize}px monospace`

        for (let i = 0; i < this.columns.length; i++) {
            const char = this.chars[Math.floor(Math.random() * this.chars.length)]
            const x = i * this.fontSize
            const y = this.columns[i]

            this.ctx.fillText(char, x, y)

            if (y > this.canvas.height && Math.random() > 0.975) {
                this.columns[i] = 0
            }

            this.columns[i] += this.fontSize
        }
    }

    animate() {
        this.draw()
        requestAnimationFrame(() => this.animate())
    }
}

// ========================================
// Particle System
// ========================================
class ParticleSystem {
    constructor(container) {
        this.container = container
        this.particles = []

        this.init()
    }

    init() {
        // Check for reduced motion
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            return
        }

        for (let i = 0; i < CONFIG.particleCount; i++) {
            this.createParticle(i)
        }
    }

    createParticle(index) {
        const particle = document.createElement("div")
        particle.className = "particle"

        // Random position
        particle.style.left = `${Math.random() * 100}%`

        // Random delay and duration
        const delay = Math.random() * 8
        const duration = 6 + Math.random() * 4

        particle.style.animationDelay = `${delay}s`
        particle.style.animationDuration = `${duration}s`

        // Random size
        const size = 2 + Math.random() * 4
        particle.style.width = `${size}px`
        particle.style.height = `${size}px`

        this.container.appendChild(particle)
        this.particles.push(particle)
    }
}

// ========================================
// Section Observer with Animations
// ========================================
class SectionAnimator {
    constructor() {
        this.sections = document.querySelectorAll(".section-animate")
        this.init()
    }

    init() {
        // Check for reduced motion
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            this.sections.forEach((section) => section.classList.add("visible"))
            return
        }

        const options = {
            root: null,
            rootMargin: "-10% 0px -10% 0px",
            threshold: 0.1,
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible")
                }
            })
        }, options)

        this.sections.forEach((section) => observer.observe(section))
    }
}

// ========================================
// Scroll to Top Button
// ========================================
function initScrollTopButton() {
    const { scrollTopBtn, terminalContent } = elements

    if (!scrollTopBtn || !terminalContent) return

    terminalContent.addEventListener("scroll", () => {
        if (terminalContent.scrollTop > 300) {
            scrollTopBtn.classList.add("visible")
        } else {
            scrollTopBtn.classList.remove("visible")
        }
    })

    scrollTopBtn.addEventListener("click", () => {
        terminalContent.scrollTo({
            top: 0,
            behavior: "smooth",
        })
    })
}

// ========================================
// Typing Effect
// ========================================
class TypingEffect {
    constructor(element, text, speed = CONFIG.typingSpeed) {
        this.element = element
        this.text = text
        this.speed = speed
        this.index = 0
    }

    static prefersReducedMotion() {
        return window.matchMedia("(prefers-reduced-motion: reduce)").matches
    }

    start() {
        return new Promise((resolve) => {
            if (TypingEffect.prefersReducedMotion()) {
                this.element.textContent = this.text
                resolve()
                return
            }

            const type = () => {
                if (this.index < this.text.length) {
                    this.element.textContent += this.text.charAt(this.index)
                    this.index++
                        setTimeout(type, this.speed)
                } else {
                    resolve()
                }
            }

            type()
        })
    }
}

// Initialize hero typing effect
async function initHeroTyping() {
    const { typedOutput, heroOutput } = elements

    if (!typedOutput || !heroOutput) return

    await delay(CONFIG.typingDelay)

    const typing = new TypingEffect(typedOutput, CONFIG.commands[0])
    await typing.start()

    await delay(300)
    heroOutput.classList.add("visible")
}

// ========================================
// Mobile Navigation
// ========================================
function initMobileNav() {
    const { menuToggle, navMobile, navLinks } = elements

    if (!menuToggle || !navMobile) return

    menuToggle.addEventListener("click", () => {
        const isExpanded = menuToggle.getAttribute("aria-expanded") === "true"
        menuToggle.setAttribute("aria-expanded", !isExpanded)
        navMobile.hidden = isExpanded
    })

    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            if (!navMobile.hidden) {
                menuToggle.setAttribute("aria-expanded", "false")
                navMobile.hidden = true
            }
        })
    })

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && !navMobile.hidden) {
            menuToggle.setAttribute("aria-expanded", "false")
            navMobile.hidden = true
            menuToggle.focus()
        }
    })
}

// ========================================
// Active Section Highlighting
// ========================================
function initActiveSection() {
    const sections = document.querySelectorAll(".section, .hero")
    const navLinks = document.querySelectorAll(".nav-link")

    if (sections.length === 0 || navLinks.length === 0) return

    const observerOptions = {
        root: null,
        rootMargin: "-20% 0px -70% 0px",
        threshold: 0,
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute("id")
                navLinks.forEach((link) => link.classList.remove("active"))
                const activeLink = document.querySelector(`.nav-link[href="#${id}"]`)
                if (activeLink) {
                    activeLink.classList.add("active")
                }
            }
        })
    }, observerOptions)

    sections.forEach((section) => observer.observe(section))
}

// ========================================
// Contact Form
// ========================================
function initContactForm() {
    const { contactForm, formResponse } = elements

    if (!contactForm || !formResponse) return

    contactForm.addEventListener("submit", async(e) => {
        e.preventDefault()

        const formData = new FormData(contactForm)
        const name = formData.get("name")
        const email = formData.get("email")
        const message = formData.get("message")

        if (!name || !email || !message) {
            showFormResponse("Error: All fields are required.", "error")
            return
        }

        if (!isValidEmail(email)) {
            showFormResponse("Error: Invalid email format.", "error")
            return
        }

        showFormResponse("Processing...", "info")

        await delay(1500)

        showFormResponse(`Message queued successfully. Thank you, ${name}! I'll respond to ${email} soon.`, "success")

        contactForm.reset()
    })
}

function showFormResponse(message, type = "info") {
    const { formResponse } = elements
    const responseText = formResponse.querySelector(".response-text")
    const responsePrompt = formResponse.querySelector(".response-prompt")

    responsePrompt.style.color =
        type === "error" ? "var(--control-red)" : type === "success" ? "var(--control-green)" : "var(--accent-pink)"

    responseText.textContent = message
    formResponse.hidden = false

    if (type === "success") {
        setTimeout(() => {
            formResponse.hidden = true
        }, 5000)
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

// ========================================
// Smooth Scroll for Navigation
// ========================================
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]')

    navLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
            const href = link.getAttribute("href")

            if (href === "#") return

            const target = document.querySelector(href)

            if (target) {
                e.preventDefault()
                const behavior = TypingEffect.prefersReducedMotion() ? "auto" : "smooth"
                target.scrollIntoView({ behavior, block: "start" })
                history.pushState(null, null, href)
            }
        })
    })
}



// ========================================
// Utility Functions
// ========================================
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

// ========================================
// Initialize Everything
// ========================================
function init() {
    // Initialize core functionality
    initMobileNav()
    initSmoothScroll()
    initActiveSection()
    initContactForm()

    initScrollTopButton()

    // Initialize animations
    new SectionAnimator()
    initHeroTyping()

    // Initialize visual effects
    if (elements.particleContainer) {
        new ParticleSystem(elements.particleContainer)
    }

    if (elements.matrixCanvas) {
        new MatrixRain(elements.matrixCanvas)
    }

    // Initialize auto-scroll
    if (elements.terminalContent && elements.scrollIndicator) {
        new AutoScroller(elements.terminalContent, elements.scrollIndicator)
    }
}

// Run when DOM is ready
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init)
} else {
    init()
}