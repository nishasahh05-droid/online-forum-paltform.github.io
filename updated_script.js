// Mock data for demonstration
        const forumData = {
            categories: [
                { id: 1, name: "Technology", threads: 1200, posts: 24500, icon: "fa-code" },
                { id: 2, name: "Music & Arts", threads: 845, posts: 18300, icon: "fa-music" },
                { id: 3, name: "Gaming", threads: 2100, posts: 45700, icon: "fa-gamepad" },
                { id: 4, name: "Health & Fitness", threads: 678, posts: 15200, icon: "fa-heartbeat" }
            ],
            threads: [
                {
                    id: 1,
                    title: "Getting Started with React 18 - Best Practices",
                    author: "John Doe",
                    replies: 42,
                    views: 1200,
                    votes: 89,
                    time: "3 hours ago"
                },
                {
                    id: 2,
                    title: "Best Workout Routines for Beginners",
                    author: "Sarah Green",
                    replies: 28,
                    views: 890,
                    votes: 67,
                    time: "5 hours ago"
                }
            ]
        };

        // Modal functionality (supports 'login' or 'register')
        let currentAuthMode = 'login';
        function toggleAuthModal(mode = 'login') {
            console.log('toggleAuthModal called with mode:', mode);
            currentAuthMode = mode;
            const modal = document.getElementById('authModal');
            const loginForm = document.getElementById('loginForm');
            const registerForm = document.getElementById('registerForm');
            
            console.log('Modal elements found:', { modal: !!modal, loginForm: !!loginForm, registerForm: !!registerForm });
            
            if (mode === 'register') {
                if (loginForm) loginForm.classList.add('hidden');
                if (registerForm) registerForm.classList.remove('hidden');
            } else {
                if (registerForm) registerForm.classList.add('hidden');
                if (loginForm) loginForm.classList.remove('hidden');
            }
            
            if (modal) {
            modal.classList.toggle('active');
                console.log('Modal active class toggled, current classes:', modal.className);
            } else {
                console.error('Modal not found!');
            }
        }

        // Simple authentication using localStorage for demo purposes
                // Users store: one email -> one password (stored as hash)
                const USERS_KEY = 'cf_users';
                const SESSION_KEY = 'cf_session'; // persisted session when remember

                function getUsers() {
                    try {
                        const raw = localStorage.getItem(USERS_KEY);
                        return raw ? JSON.parse(raw) : {};
                    } catch (e) {
                        return {};
                    }
                }
                function saveUsers(users) {
                    localStorage.setItem(USERS_KEY, JSON.stringify(users));
                }

                async function hashPassword(password) {
                    const enc = new TextEncoder();
                    const data = enc.encode(password);
                    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
                    const hashArray = Array.from(new Uint8Array(hashBuffer));
                    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
                }

                // Session helpers: session stored in sessionStorage unless persisted to localStorage when 'remember'
                function saveSession(session, remember) {
                    if (remember) {
                        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
                    } else {
                        sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
                    }
                }
                function clearSession() {
                    localStorage.removeItem(SESSION_KEY);
                    sessionStorage.removeItem(SESSION_KEY);
                }
                function getSession() {
                    const s = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY);
                    return s ? JSON.parse(s) : null;
                }

        function updateAuthUI() {
            const user = getSession();
            const guestButtons = document.getElementById('guestButtons');
            const userMenu = document.getElementById('userMenu');
            const userName = document.getElementById('userName');
            const userAvatar = document.getElementById('userAvatar');
            const dropdownName = document.getElementById('dropdownName');
            const createPostButton = document.getElementById('createPostButton');

            // Personalize hero
            const heroTitle = document.querySelector('.hero-title');
            const heroCTAs = document.querySelectorAll('.hero-cta');

            if (user) {
                guestButtons.classList.add('hidden');
                userMenu.classList.remove('hidden');
                if (createPostButton) createPostButton.classList.remove('hidden');
                userName.textContent = user.name;
                dropdownName.textContent = user.name;
                userAvatar.textContent = (user.name || 'U').split(' ').map(n => n[0]).slice(0,2).join('');
                if (heroTitle) heroTitle.textContent = `Welcome back, ${user.name}`;
                if (heroCTAs) heroCTAs.forEach(c => c.classList.add('hidden'));

                // Update hero subtitle to a personalized invite
                const heroSubtitle = document.querySelector('.hero-subtitle');
                if (heroSubtitle) heroSubtitle.textContent = `Hi ${user.name}, great to see you! Share your ideas, learn from others, and grow together in our community.`;
                // Update user's post count in dropdown
                const postCountEl = document.getElementById('userPostCount');
                if (postCountEl) postCountEl.textContent = String(getUserPostCount(user.email));
            } else {
                guestButtons.classList.remove('hidden');
                userMenu.classList.add('hidden');
                if (createPostButton) createPostButton.classList.add('hidden');
                if (heroTitle) heroTitle.textContent = 'Welcome to ConnectForum';
                if (heroCTAs) heroCTAs.forEach(c => c.classList.remove('hidden'));

                // Reset hero subtitle when logged out
                const heroSubtitle = document.querySelector('.hero-subtitle');
                if (heroSubtitle) heroSubtitle.textContent = 'Join the conversation. Share your thoughts. Connect with like-minded people.';
                const postCountEl = document.getElementById('userPostCount');
                if (postCountEl) postCountEl.textContent = '0';
            }
        }

        // Return number of posts authored by given email (reads from localStorage)
        function getUserPostCount(email) {
            if (!email) return 0;
            try {
                const posts = JSON.parse(localStorage.getItem('cf_posts') || '[]');
                return posts.filter(p => p.authorEmail === email).length;
            } catch (e) {
                return 0;
            }
        }
         
        // Logout and user menu toggle
        function clearUser() {
            clearSession();
        }

        function logout() {
            clearUser();
            updateAuthUI();

// =====================
// Notification System
// =====================





            const dd = document.getElementById('userDropdown');
            if (dd) dd.classList.add('hidden');
        }

        function toggleUserDropdown() {
            const dd = document.getElementById('userDropdown');
            if (dd) dd.classList.toggle('hidden');
        }

        // Close auth modal helper
        function closeAuthModal() {
            const modal = document.getElementById('authModal');
            if (!modal) return;
            modal.classList.remove('active');
            const reg = document.getElementById('registerForm');
            const log = document.getElementById('loginForm');
            if (reg) reg.classList.add('hidden');
            if (log) log.classList.remove('hidden');
            // Clear error messages when closing modal
            clearErrorMessages();
        }
        
        // Error message helper functions
        function showError(formType, message) {
            const errorElement = document.getElementById(formType + 'Error');
            if (errorElement) {
                errorElement.textContent = message;
                errorElement.classList.remove('hidden');
                // Auto-hide after 5 seconds
                setTimeout(() => {
                    errorElement.classList.add('hidden');
                }, 5000);
            }
        }
        
        function clearErrorMessages() {
            const loginError = document.getElementById('loginError');
            const registerError = document.getElementById('registerError');
            if (loginError) loginError.classList.add('hidden');
            if (registerError) registerError.classList.add('hidden');
        }
        
        function showSuccessMessage(message) {
            // Create a temporary success message element
            const successDiv = document.createElement('div');
            successDiv.className = 'fixed top-4 right-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm z-50 shadow-lg';
            successDiv.textContent = message;
            document.body.appendChild(successDiv);
            
            // Auto-remove after 3 seconds
            setTimeout(() => {
                if (successDiv.parentNode) {
                    successDiv.parentNode.removeChild(successDiv);
                }
            }, 3000);
        }
        
        // Test function for debugging - call from browser console
        window.testLogin = function(email, password) {
            console.log('Testing login with:', email, password);
            const users = getUsers();
            console.log('Current users:', users);
            
            if (users[email]) {
                console.log('User found:', users[email]);
                hashPassword(password).then(hash => {
                    console.log('Password hash:', hash);
                    console.log('Stored hash:', users[email].hash);
                    console.log('Match:', hash === users[email].hash);
                });
            } else {
                console.log('User not found for email:', email);
            }
        };
        
        // Test function for registration
        window.testRegister = function(name, email, password) {
            console.log('Testing registration with:', name, email, password);
            const users = getUsers();
            console.log('Current users before:', users);
            
            hashPassword(password).then(hash => {
                users[email] = { name, email, hash };
                saveUsers(users);
                console.log('User saved, new users:', getUsers());
            });
        };
        
        // Create Post Modal Functions
        function openCreatePostModal() {
            const modal = document.getElementById('createPostModal');
            if (modal) {
                modal.classList.add('active');
                // Focus on title input
                setTimeout(() => {
                    const titleInput = document.getElementById('postTitle');
                    if (titleInput) titleInput.focus();
                }, 100);
            }
        }
        
        function closeCreatePostModal() {
            const modal = document.getElementById('createPostModal');
            if (modal) {
                modal.classList.remove('active');
                // Clear form
                const form = document.getElementById('createPostForm');
                if (form) form.reset();
            }
        }

        // Initialization on DOM ready: attach listeners safely
        document.addEventListener('DOMContentLoaded', function() {
            console.log('DOM loaded, initializing authentication system');
            // Auth UI
            updateAuthUI();

            let notifications = [
    { text: "Login successful", time: "Just now" },
    { text: "New post published", time: "2 min ago" }
];

const notifyBtn = document.getElementById("notifyBtn");
const notifyPanel = document.getElementById("notifyPanel");
const notifyList = document.getElementById("notifyList");

function loadNotifications() {
    if (!notifyList) return;
    notifyList.innerHTML = notifications
        .map(n => `
            <li class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                <p class="font-medium">${n.text}</p>
                <span class="opacity-60 text-xs">${n.time}</span>
            </li>
        `)
        .join("");
}

loadNotifications();

if (notifyBtn && notifyPanel) {
    notifyBtn.addEventListener("click", () => {
        notifyPanel.classList.toggle("hidden");
    });
}
            
            // Test if elements exist
            console.log('Testing element existence:');
            console.log('Login form:', document.getElementById('loginForm'));
            console.log('Register form:', document.getElementById('registerForm'));
            console.log('Auth modal:', document.getElementById('authModal'));
            console.log('Login email input:', document.getElementById('loginEmail'));
            console.log('Login password input:', document.getElementById('loginPassword'));

            // Register form handling
            const registerEl = document.getElementById('registerForm');
            if (registerEl) {
                console.log('Register form found, adding event listener');
                registerEl.addEventListener('submit', async function(e) {
                    e.preventDefault();
                    console.log('Register form submitted');
                    clearErrorMessages(); // Clear any existing errors
                    
                    const name = document.getElementById('regName').value.trim();
                    const email = document.getElementById('regEmail').value.trim().toLowerCase();
                    const password = document.getElementById('regPassword').value;
                    
                    console.log('Registration attempt:', { name, email, password: password ? '*' : 'empty' });
                    
                    // Validation
                    if (!name || !email || !password) {
                        console.log('Validation failed: missing fields');
                        showError('register', 'Please fill all registration fields');
                        return;
                    }
                    
                    if (password.length < 6) {
                        console.log('Validation failed: password too short');
                        showError('register', 'Password must be at least 6 characters long');
                        return;
                    }
                    
                    if (!email.includes('@') || !email.includes('.')) {
                        console.log('Validation failed: invalid email');
                        showError('register', 'Please enter a valid email address');
                        return;
                    }
                    
                    const users = getUsers();
                    console.log('Current users before registration:', users);
                    if (users[email]) {
                        console.log('User already exists:', email);
                        showError('register', 'An account with that email already exists. Please login instead.');
                        return;
                    }
                    
                    try {
                    const hash = await hashPassword(password);
                        console.log('Password hash created:', hash);
                    users[email] = { name, email, hash };
                    saveUsers(users);
                        console.log('User saved, users after registration:', users);
                        
                    // auto-login after register
                    saveSession({ name, email }, true);
                    updateAuthUI();
                    closeAuthModal();
                        
                        // Show personalized success message
                        showSuccessMessage(`Hi ${name}, great to see you !\nShare your ideas, learn from others, and grow together in our community.`);
                    } catch (error) {
                        console.error('Registration error:', error);
                        showError('register', 'Registration failed. Please try again.');
                    }
                });
            } else {
                console.error('Register form not found!');
            }

            // Initialize Three.js scenes for category canvases (if Three is loaded)
            // (login handler inserted before this)
            
            // (login handler moved earlier into DOMContentLoaded)

            if (window.THREE) {
                initCategory3D();
                if (THREE.FontLoader) {
                    // initialize hero 3D text if font loader is available
                    try { initHeroText3D(); } catch (e) { console.warn('Hero 3D init failed', e); }
                }
            }


        // ---------- Three.js category scenes ----------
        const categoryScenes = [];
        function initCategory3D() {
            const canvases = document.querySelectorAll('.category-canvas');
            canvases.forEach((canvas, idx) => {
                try {
                    const width = canvas.clientWidth;
                    const height = canvas.clientHeight;
                    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
                    renderer.setSize(width, height);
                    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

                    const scene = new THREE.Scene();
                    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
                    camera.position.z = 3;

                    // simple colorful geometry per index
                    const geom = idx % 2 === 0 ? new THREE.TorusKnotGeometry(0.6, 0.18, 100, 16) : new THREE.BoxGeometry(1.0,1.0,1.0);
                    const mat = new THREE.MeshStandardMaterial({ color: new THREE.Color().setHSL((idx*0.15)%1, 0.7, 0.5), metalness:0.4, roughness:0.3, emissive:0x000000 });
                    const mesh = new THREE.Mesh(geom, mat);
                    scene.add(mesh);

                    // lights
                    const amb = new THREE.AmbientLight(0xffffff, 0.6);
                    scene.add(amb);
                    const dir = new THREE.DirectionalLight(0xffffff, 0.6);
                    dir.position.set(5,5,5);
                    scene.add(dir);

                    categoryScenes.push({ canvas, renderer, scene, camera, mesh, resize: () => {
                        const w = canvas.clientWidth;
                        const h = canvas.clientHeight;
                        renderer.setSize(w,h);
                        camera.aspect = w/h; camera.updateProjectionMatrix();
                    }});
                } catch (e) {
                    // fail gracefully
                    console.warn('Three init failed for canvas', e);
                }
            });

            // animation loop
            function animate() {
                categoryScenes.forEach(s => {
                    s.mesh.rotation.x += 0.01;
                    s.mesh.rotation.y += 0.02;
                    s.renderer.render(s.scene, s.camera);
                });
                requestAnimationFrame(animate);
            }
            animate();

            // handle resize
            window.addEventListener('resize', () => {
                categoryScenes.forEach(s => s.resize());
            });
        }
            // Login form handling
            const loginEl = document.getElementById('loginForm');
            if (loginEl) {
                console.log('Login form found, adding event listener');
                loginEl.addEventListener('submit', async function(e) {
                    e.preventDefault();
                    console.log('Login form submitted');
                    clearErrorMessages(); // Clear any existing errors
                    
                    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
                    const password = document.getElementById('loginPassword').value;
                    const remember = document.querySelector('#loginForm input[type=checkbox]')?.checked;
                    
                    console.log('Login attempt:', { email, password: password ? '*' : 'empty', remember });
                    
                    // Validation
                    if (!email || !password) {
                        console.log('Validation failed: missing fields');
                        showError('login', 'Please enter email and password');
                        return;
                    }
                    
                    if (!email.includes('@') || !email.includes('.')) {
                        console.log('Validation failed: invalid email');
                        showError('login', 'Please enter a valid email address');
                        return;
                    }
                    
                    try {
                    const users = getUsers();
                        console.log('Stored users:', users);
                    const record = users[email];
                        console.log('User record for', email, ':', record);
                        
                    if (!record) {
                            console.log('No user found for email:', email);
                            showError('login', 'No account found for that email. Please register first.');
                        return;
                    }
                        
                    const hash = await hashPassword(password);
                        console.log('Password hash:', hash);
                        console.log('Stored hash:', record.hash);
                        console.log('Hashes match:', hash === record.hash);
                        
                    if (hash !== record.hash) {
                            console.log('Password mismatch');
                            showError('login', 'Incorrect password. Please try again.');
                        return;
                    }
                        
                        console.log('Login successful, saving session');
                    saveSession({ name: record.name, email }, Boolean(remember));
                    updateAuthUI();
                    closeAuthModal();
                        
                        // Show success message
                        showSuccessMessage(`Welcome back, ${record.name}!`);
                    } catch (error) {
                        console.error('Login error:', error);
                        showError('login', 'Login failed. Please try again.');
                    }
                });
            } else {
                console.error('Login form not found!');
            }

            // Modal backdrop click to close
            const modal = document.getElementById('authModal');
            if (modal) {
                modal.addEventListener('click', function(e) {
                    if (e.target === modal) {
                        closeAuthModal();
                    }
                });
            }

            // Escape key closes modal and dropdown
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    const modal = document.getElementById('authModal');
                    if (modal && modal.classList.contains('active')) {
                        closeAuthModal();
                    }
                    const dd = document.getElementById('userDropdown');
                    if (dd && !dd.classList.contains('hidden')) dd.classList.add('hidden');
                }
            });

            // Create Post form handling
            const createPostForm = document.getElementById('createPostForm');
            if (createPostForm) {
                createPostForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    
                    const title = document.getElementById('postTitle').value.trim();
                    const category = document.getElementById('postCategory').value;
                    const content = document.getElementById('postContent').value.trim();
                    
                    if (!title || !category || !content) {
                        alert('Please fill in all fields');
                        return;
                    }
                    
                    // Get current user
                    const user = getSession();
                    if (!user) {
                        alert('Please login to create a post');
                        return;
                    }
                    
                    // Create post object
                    const post = {
                        id: Date.now(),
                        title,
                        category,
                        content,
                        author: user.name,
                        authorEmail: user.email,
                        createdAt: new Date().toISOString(),
                        likes: 0,
                        replies: 0,
                        views: 0
                    };
                    
                    // Save post to localStorage (in a real app, this would go to a server)
                    const posts = JSON.parse(localStorage.getItem('cf_posts') || '[]');
                    posts.unshift(post); // Add to beginning
                    localStorage.setItem('cf_posts', JSON.stringify(posts));
                    
                    // Show success message
                    showSuccessMessage('Post created successfully!');
                    
                    // Close modal
                    closeCreatePostModal();
                    // Update UI (post count, etc.)
                    updateAuthUI();
                    
                    // Optionally refresh the page or update the UI
                    console.log('Post created:', post);
                });
            }

            // Theme init and toggle
            initTheme();
            const toggle = document.getElementById('themeToggle');
            if (toggle) {
                toggle.addEventListener('click', function() {
                    const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
                    const next = current === 'light' ? 'dark' : 'light';
                    applyTheme(next);
                    saveTheme(next);
                    
                    // Add a subtle animation feedback
                    toggle.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        toggle.style.transform = 'scale(1)';
                    }, 150);
                });
            }

            // Optional: attach mobile/menu listeners if elements exist (handled earlier)
        });

        // Theme handling: default to dark-first, but respect saved choice or system preference
        const THEME_KEY = 'cf_theme';
        function getSavedTheme() {
            return localStorage.getItem(THEME_KEY);
        }
        function saveTheme(theme) {
            localStorage.setItem(THEME_KEY, theme);
        }
        function applyTheme(theme) {
            // theme: 'dark' | 'light'
            document.documentElement.setAttribute('data-theme', theme === 'light' ? 'light' : 'dark');
            // update icon
            const icon = document.getElementById('themeIcon');
            const tooltip = document.getElementById('themeTooltip');
            const button = document.getElementById('themeToggle');
            
            if (!icon) return;
            
            if (theme === 'light') {
                // Moon icon for light mode (clicking will switch to dark)
                icon.innerHTML = '<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"></path>';
                if (tooltip) tooltip.textContent = 'Switch to dark mode';
                if (button) button.title = 'Switch to dark mode';
            } else {
                // Sun icon for dark mode (clicking will switch to light)
                icon.innerHTML = '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>';
                if (tooltip) tooltip.textContent = 'Switch to light mode';
                if (button) button.title = 'Switch to light mode';
            }
        }

        function initTheme() {
            const saved = getSavedTheme();
            if (saved) {
                applyTheme(saved);
                return;
            }
            // No saved preference: prefer dark but respect system prefers-color-scheme
            const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
            applyTheme(prefersLight ? 'light' : 'dark');
        }

        // Simulate loading states
        function simulateLoading(button) {
            const originalText = button.textContent;
            button.disabled = true;
            button.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Loading...';
            
            setTimeout(() => {
                button.disabled = false;
                button.textContent = originalText;
            }, 2000);
        }

        // Report post functionality
        function reportPost(postId) {
            const reason = prompt('Please specify the reason for reporting this post:');
            if (reason) {
                alert('Thank you for your report. Moderators will review this content.');
                // In a real application, this would send data to the backend
            }
        }

        // Vote system
        function vote(threadId, type) {
            alert(`${type} vote registered for thread ${threadId}`);
            // In a real application, this would update the vote count via API
        }
            
            // Optional: attach mobile/menu listeners if elements exist
            const menuToggle = document.getElementById('menuToggle');
            const nav = document.getElementById('nav');
            if (menuToggle && nav) {
                menuToggle.addEventListener('click', function() {
                    nav.classList.toggle('active');
                    const spans = menuToggle.querySelectorAll('span');
                    if (nav.classList.contains('active')) {
                        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                        spans[1].style.opacity = '0';
                        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
                    } else {
                        spans[0].style.transform = 'none';
                        spans[1].style.opacity = '1';
                        spans[2].style.transform = 'none';
                    }
                });
            }
        
            document.addEventListener('click', function(event) {
                if (nav && menuToggle) {
                    const isClickInsideNav = nav.contains(event.target);
                    const isClickOnToggle = menuToggle.contains(event.target);
                    if (!isClickInsideNav && !isClickOnToggle && nav.classList.contains('active')) {
                        nav.classList.remove('active');
                        const spans = menuToggle.querySelectorAll('span');
                        spans[0].style.transform = 'none';
                        spans[1].style.opacity = '1';
                        spans[2].style.transform = 'none';
                    }
                }
            });

        // Hero 3D animated text initializer (appended at end to avoid blocking)
        function initHeroText3D() {
            const canvas = document.getElementById('heroTextCanvas');
            if (!canvas || !window.THREE || !THREE.FontLoader) return;

            const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
            renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / Math.max(1, canvas.clientHeight), 0.1, 1000);
            camera.position.z = 40;

            const light = new THREE.DirectionalLight(0xffffff, 1.0);
            light.position.set(0, 0, 100);
            scene.add(light);

            const loader = new THREE.FontLoader();
            loader.load('https://unpkg.com/three@0.155.0/examples/fonts/helvetiker_regular.typeface.json', function(font) {
                const headingEl = document.querySelector('.hero-title');
                const text = (headingEl && headingEl.textContent) ? headingEl.textContent.trim() : 'Welcome';
                const letters = text.split('');

                const group = new THREE.Group();
                scene.add(group);

                let offsetX = 0;
                const material = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.2, roughness: 0.3 });

                letters.forEach((ch, i) => {
                    const geom = new THREE.TextGeometry(ch, { font, size: 6, height: 1, curveSegments: 6 });
                    geom.computeBoundingBox();
                    const mesh = new THREE.Mesh(geom, material);
                    const w = geom.boundingBox.max.x - geom.boundingBox.min.x;
                    mesh.position.x = offsetX + w/2;
                    mesh.position.y = 0;
                    mesh.scale.set(0.001,0.001,0.001);
                    group.add(mesh);
                    offsetX += w + 1;

                    const delay = i * 120;
                    setTimeout(() => {
                        const duration = 500;
                        const start = performance.now();
                        function animateLetter(t) {
                            const p = Math.min(1, (t - start) / duration);
                            const s = 0.001 + p * 1.0;
                            mesh.scale.set(s, s, s);
                            mesh.rotation.y = (1 - p) * Math.PI * 0.5;
                            if (p < 1) requestAnimationFrame(animateLetter);
                        }
                        requestAnimationFrame(animateLetter);
                    }, delay);
                });

                group.position.x = -(offsetX/2);

                function animate() {
                    group.rotation.y += 0.002;
                    renderer.render(scene, camera);
                    requestAnimationFrame(animate);
                }
                function resize() {
                    const w = canvas.clientWidth;
                    const h = Math.max(1, canvas.clientHeight);
                    renderer.setSize(w, h);
                    camera.aspect = w / h; camera.updateProjectionMatrix();
                }
                resize();
                animate();
                window.addEventListener('resize', resize);
            });
        }