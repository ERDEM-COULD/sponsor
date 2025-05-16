document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const authModal = document.getElementById('authModal');
    const mainContent = document.getElementById('mainContent');
    const applicationPage = document.getElementById('applicationPage');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const showRegister = document.getElementById('showRegister');
    const applyBtn = document.getElementById('applyBtn');
    const backBtn = document.getElementById('backBtn');
    const settingsBtn = document.getElementById('settingsBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const settingsModal = document.getElementById('settingsModal');
    const accountForm = document.getElementById('accountForm');
    const applicationForm = document.getElementById('applicationForm');
    const editApplicationBtn = document.getElementById('editApplicationBtn');
    const deleteApplicationBtn = document.getElementById('deleteApplicationBtn');
    const printApplicationBtn = document.getElementById('printApplicationBtn');
    const applicationInfo = document.getElementById('applicationInfo');
    const sponsorsSlider = document.querySelector('.sponsors-slider');
    
    // Close buttons
    const closeButtons = document.querySelectorAll('.close');
    
    // Tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (currentUser) {
        authModal.style.display = 'none';
        mainContent.style.display = 'block';
        loadSponsors();
        checkApplication();
    } else {
        authModal.style.display = 'block';
    }
    
    // Event Listeners
    showRegister.addEventListener('click', function(e) {
        e.preventDefault();
        loginForm.style.display = 'none';
        registerForm.style.display = 'flex';
    });
    
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
    
    window.addEventListener('click', function(e) {
        if (e.target === authModal || e.target === settingsModal) {
            e.target.style.display = 'none';
        }
    });
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            authModal.style.display = 'none';
            mainContent.style.display = 'block';
            loadSponsors();
            checkApplication();
        } else {
            alert('E-posta veya şifre hatalı!');
        }
    });
    
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        if (users.some(u => u.email === email)) {
            alert('Bu e-posta adresi zaten kayıtlı!');
            return;
        }
        
        const newUser = { name, email, password };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        
        authModal.style.display = 'none';
        mainContent.style.display = 'block';
        loadSponsors();
    });
    
    applyBtn.addEventListener('click', function() {
        mainContent.style.display = 'none';
        applicationPage.style.display = 'block';
        
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const applications = JSON.parse(localStorage.getItem('applications')) || [];
        const userApplication = applications.find(app => app.email === currentUser.email);
        
        if (userApplication) {
            // Fill the form with existing application data
            document.getElementById('firstName').value = userApplication.firstName;
            document.getElementById('lastName').value = userApplication.lastName;
            document.getElementById('phone').value = userApplication.phone;
            document.getElementById('age').value = userApplication.age;
            document.getElementById('school').value = userApplication.school;
            document.getElementById('location').value = userApplication.location;
            document.getElementById('website').value = userApplication.website || '';
            document.getElementById('company').value = userApplication.company;
            document.getElementById('assistant').value = userApplication.assistant;
            document.getElementById('postalCode').value = userApplication.postalCode;
            document.getElementById('comments').value = userApplication.comments || '';
            document.getElementById('email').value = userApplication.email;
        } else {
            // Pre-fill with user data
            document.getElementById('email').value = currentUser.email;
        }
    });
    
    backBtn.addEventListener('click', function() {
        applicationPage.style.display = 'none';
        mainContent.style.display = 'block';
    });
    
    settingsBtn.addEventListener('click', function() {
        settingsModal.style.display = 'block';
        
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        document.getElementById('editName').value = currentUser.name;
        document.getElementById('editEmail').value = currentUser.email;
    });
    
    logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('currentUser');
        location.reload();
    });
    
    accountForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        const name = document.getElementById('editName').value || currentUser.name;
        const email = document.getElementById('editEmail').value || currentUser.email;
        const password = document.getElementById('editPassword').value || currentUser.password;
        
        // Update user in users array
        const userIndex = users.findIndex(u => u.email === currentUser.email);
        if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], name, email, password };
            localStorage.setItem('users', JSON.stringify(users));
        }
        
        // Update current user
        const updatedUser = { name, email, password };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        
        alert('Bilgileriniz güncellendi!');
        settingsModal.style.display = 'none';
    });
    
    applicationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
        const application = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            phone: document.getElementById('phone').value,
            age: document.getElementById('age').value,
            school: document.getElementById('school').value,
            location: document.getElementById('location').value,
            website: document.getElementById('website').value,
            company: document.getElementById('company').value,
            assistant: document.getElementById('assistant').value,
            postalCode: document.getElementById('postalCode').value,
            comments: document.getElementById('comments').value,
            email: document.getElementById('email').value,
            date: new Date().toLocaleDateString()
        };
        
        let applications = JSON.parse(localStorage.getItem('applications')) || [];
        
        // Remove old application if exists
        applications = applications.filter(app => app.email !== currentUser.email);
        
        // Add new application
        applications.push(application);
        localStorage.setItem('applications', JSON.stringify(applications));
        
        // Redirect to mail with prefilled data
        const mailtoLink = `mailto:merdem58171.3@gmail.com?subject=Sponsorluk Başvurusu&body=
            İsim: ${application.firstName}%0D%0A
            Soyad: ${application.lastName}%0D%0A
            Telefon: ${application.phone}%0D%0A
            Yaş: ${application.age}%0D%0A
            Okul: ${application.school}%0D%0A
            Yaşadığınız Yer: ${application.location}%0D%0A
            Web Site: ${application.website || 'Yok'}%0D%0A
            Şirket İsmi: ${application.company}%0D%0A
            Yardımcı İsmi: ${application.assistant}%0D%0A
            Posta Kodu: ${application.postalCode}%0D%0A
            Yorumlar: ${application.comments || 'Yok'}%0D%0A
            E-posta: ${application.email}%0D%0A
            Başvuru Tarihi: ${application.date}
        `;
        
        window.location.href = mailtoLink;
        
        // Go back to main page
        applicationPage.style.display = 'none';
        mainContent.style.display = 'block';
        checkApplication();
    });
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Update active tab button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Update active tab content
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(`${tabId}Tab`).classList.add('active');
        });
    });
    
    editApplicationBtn.addEventListener('click', function() {
        settingsModal.style.display = 'none';
        mainContent.style.display = 'none';
        applicationPage.style.display = 'block';
    });
    
    deleteApplicationBtn.addEventListener('click', function() {
        if (confirm('Başvurunuzu silmek istediğinize emin misiniz?')) {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            let applications = JSON.parse(localStorage.getItem('applications')) || [];
            
            applications = applications.filter(app => app.email !== currentUser.email);
            localStorage.setItem('applications', JSON.stringify(applications));
            
            applicationInfo.innerHTML = '<p>Henüz başvuru yapılmamış.</p>';
            editApplicationBtn.classList.add('hidden');
            deleteApplicationBtn.classList.add('hidden');
            printApplicationBtn.classList.add('hidden');
        }
    });
    
    printApplicationBtn.addEventListener('click', function() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const applications = JSON.parse(localStorage.getItem('applications')) || [];
        const application = applications.find(app => app.email === currentUser.email);
        
        if (application) {
            const printWindow = window.open('', '', 'width=600,height=600');
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Başvuru Bilgileri</title>
                        <style>
                            body { font-family: Arial; line-height: 1.6; padding: 20px; }
                            h1 { color: #2c3e50; margin-bottom: 20px; }
                            .info-item { margin-bottom: 10px; }
                            .label { font-weight: bold; }
                        </style>
                    </head>
                    <body>
                        <h1>Başvuru Bilgileri</h1>
                        <div class="info-item"><span class="label">İsim:</span> ${application.firstName}</div>
                        <div class="info-item"><span class="label">Soyad:</span> ${application.lastName}</div>
                        <div class="info-item"><span class="label">Telefon:</span> ${application.phone}</div>
                        <div class="info-item"><span class="label">Yaş:</span> ${application.age}</div>
                        <div class="info-item"><span class="label">Okul:</span> ${application.school}</div>
                        <div class="info-item"><span class="label">Yaşadığınız Yer:</span> ${application.location}</div>
                        <div class="info-item"><span class="label">Web Site:</span> ${application.website || 'Yok'}</div>
                        <div class="info-item"><span class="label">Şirket İsmi:</span> ${application.company}</div>
                        <div class="info-item"><span class="label">Yardımcı İsmi:</span> ${application.assistant}</div>
                        <div class="info-item"><span class="label">Posta Kodu:</span> ${application.postalCode}</div>
                        <div class="info-item"><span class="label">Yorumlar:</span> ${application.comments || 'Yok'}</div>
                        <div class="info-item"><span class="label">E-posta:</span> ${application.email}</div>
                        <div class="info-item"><span class="label">Başvuru Tarihi:</span> ${application.date}</div>
                        <script>
                            window.onload = function() {
                                setTimeout(function() {
                                    window.print();
                                    window.close();
                                }, 200);
                            };
                        </script>
                    </body>
                </html>
            `);
            printWindow.document.close();
        }
    });
    
    // Slider navigation
    document.querySelector('.prev').addEventListener('click', function() {
        sponsorsSlider.scrollBy({ left: -300, behavior: 'smooth' });
    });
    
    document.querySelector('.next').addEventListener('click', function() {
        sponsorsSlider.scrollBy({ left: 300, behavior: 'smooth' });
    });
    
    // Functions
    function loadSponsors() {
        const sponsors = [
            {
                name: "Animatronik",
                description: "En iyi 3d figür",
                website: "https://web-site-belirtilmemiş",
                logo: "https://via.placeholder.com/150?text=TechCorp"
            },
            {
                name: "InnoSoft",
                description: "Yazılım geliştirmede yenilikçi",
                website: "https://innosoft.example.com",
                logo: "https://via.placeholder.com/150?text=InnoSoft"
            },
            {
                name: "GreenEnergy",
                description: "Sürdürülebilir enerji çözümleri",
                website: "https://greenenergy.example.com",
                logo: "https://via.placeholder.com/150?text=GreenEnergy"
            },
            {
                name: "EduFuture",
                description: "Eğitim teknolojilerinde öncü",
                website: "https://edufuture.example.com",
                logo: "https://via.placeholder.com/150?text=EduFuture"
            },
            {
                name: "HealthPlus",
                description: "Sağlık hizmetlerinde mükemmellik",
                website: "https://healthplus.example.com",
                logo: "https://via.placeholder.com/150?text=HealthPlus"
            },
            {
                name: "FoodExpress",
                description: "Hızlı ve sağlıklı yemek hizmeti",
                website: "https://foodexpress.example.com",
                logo: "https://via.placeholder.com/150?text=FoodExpress"
            },
            {
                name: "TravelNow",
                description: "Seyahat deneyimleriniz için",
                website: "https://travelnow.example.com",
                logo: "https://via.placeholder.com/150?text=TravelNow"
            },
            {
                name: "BuildRight",
                description: "İnşaat sektöründe kalite",
                website: "https://buildright.example.com",
                logo: "https://via.placeholder.com/150?text=BuildRight"
            },
            {
                name: "FashionHub",
                description: "Moda dünyasının merkezi",
                website: "https://fashionhub.example.com",
                logo: "https://via.placeholder.com/150?text=FashionHub"
            },
            {
                name: "AutoMasters",
                description: "Otomotiv sektöründe uzman",
                website: "https://automasters.example.com",
                logo: "https://via.placeholder.com/150?text=AutoMasters"
            }
        ];
        
        sponsorsSlider.innerHTML = '';
        
        sponsors.forEach(sponsor => {
            const card = document.createElement('div');
            card.className = 'sponsor-card';
            card.innerHTML = `
                <img src="${sponsor.logo}" alt="${sponsor.name}" style="width:100%; margin-bottom:10px;">
                <h3>${sponsor.name}</h3>
                <p>${sponsor.description}</p>
            `;
            card.addEventListener('click', function() {
                window.open(sponsor.website, '_blank');
            });
            sponsorsSlider.appendChild(card);
        });
    }
    loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Admin kontrolü
    if (email === "merdem58171.3@gmail.com" && password === "ADMİNHGFD216789ADMİN") {
        const adminUser = {
            name: "Admin",
            email: "merdem58171.3@gmail.com",
            password: "ADMİNHGFD216789ADMİN",
            isAdmin: true
        };
        localStorage.setItem('currentUser', JSON.stringify(adminUser));
        authModal.style.display = 'none';
        mainContent.style.display = 'block';
        loadSponsors();
        checkApplication();
        addAdminFeatures(); // Admin özelliklerini ekle
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        user.isAdmin = false; // Normal kullanıcılar için admin değil
        localStorage.setItem('currentUser', JSON.stringify(user));
        authModal.style.display = 'none';
        mainContent.style.display = 'block';
        loadSponsors();
        checkApplication();
    } else {
        alert('E-posta veya şifre hatalı!');
    }
});

// Yeni admin özellikleri fonksiyonu
function addAdminFeatures() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (currentUser.isAdmin) {
        // Navbar'a admin butonu ekle
        const nav = document.querySelector('nav div');
        const adminBtn = document.createElement('button');
        adminBtn.id = 'adminPanelBtn';
        adminBtn.textContent = 'Admin Paneli';
        nav.insertBefore(adminBtn, document.getElementById('settingsBtn'));
        
        // Admin paneli modalı oluştur
        const adminModal = document.createElement('div');
        adminModal.id = 'adminModal';
        adminModal.className = 'modal';
        adminModal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>Admin Paneli</h2>
                <div class="tabs">
                    <button class="tab-btn active" data-tab="users">Kullanıcılar</button>
                    <button class="tab-btn" data-tab="applications">Başvurular</button>
                </div>
                <div id="usersTab" class="tab-content active">
                    <table id="usersTable">
                        <thead>
                            <tr>
                                <th>İsim</th>
                                <th>E-posta</th>
                                <th>İşlemler</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>
                <div id="applicationsTab" class="tab-content">
                    <table id="applicationsTable">
                        <thead>
                            <tr>
                                <th>İsim</th>
                                <th>Şirket</th>
                                <th>Tarih</th>
                                <th>İşlemler</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>
            </div>
        `;
        document.body.appendChild(adminModal);
        
        // Admin paneli butonu event listener
        adminBtn.addEventListener('click', function() {
            adminModal.style.display = 'block';
            loadAdminUsers();
            loadAdminApplications();
        });
        
        // Admin modal tabları
        adminModal.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                
                adminModal.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                adminModal.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                adminModal.querySelector(`#${tabId}Tab`).classList.add('active');
            });
        });
        
        // Admin modal kapatma
        adminModal.querySelector('.close').addEventListener('click', function() {
            adminModal.style.display = 'none';
        });
    }
}

// Admin kullanıcıları yükleme fonksiyonu
function loadAdminUsers() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const tbody = document.querySelector('#usersTable tbody');
    tbody.innerHTML = '';
    
    users.forEach(user => {
        if (user.email !== "merdem58171.3@gmail.com") { // Admini listeleme
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>
                    <button class="delete-user" data-email="${user.email}">Sil</button>
                </td>
            `;
            tbody.appendChild(tr);
        }
    });
    
    // Kullanıcı silme butonları
    document.querySelectorAll('.delete-user').forEach(btn => {
        btn.addEventListener('click', function() {
            const email = this.getAttribute('data-email');
            if (confirm(`${email} kullanıcısını silmek istediğinize emin misiniz?`)) {
                let users = JSON.parse(localStorage.getItem('users')) || [];
                users = users.filter(u => u.email !== email);
                localStorage.setItem('users', JSON.stringify(users));
                loadAdminUsers();
            }
        });
    });
}

// Admin başvuruları yükleme fonksiyonu
function loadAdminApplications() {
    const applications = JSON.parse(localStorage.getItem('applications')) || [];
    const tbody = document.querySelector('#applicationsTable tbody');
    tbody.innerHTML = '';
    
    applications.forEach(app => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${app.firstName} ${app.lastName}</td>
            <td>${app.company}</td>
            <td>${app.date}</td>
            <td>
                <button class="view-application" data-email="${app.email}">Görüntüle</button>
                <button class="delete-application" data-email="${app.email}">Sil</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    
    // Başvuru görüntüleme butonları
    document.querySelectorAll('.view-application').forEach(btn => {
        btn.addEventListener('click', function() {
            const email = this.getAttribute('data-email');
            const applications = JSON.parse(localStorage.getItem('applications')) || [];
            const application = applications.find(app => app.email === email);
            
            if (application) {
                alert(`
                    İsim: ${application.firstName} ${application.lastName}
                    Telefon: ${application.phone}
                    Yaş: ${application.age}
                    Okul: ${application.school}
                    Konum: ${application.location}
                    Şirket: ${application.company}
                    Başvuru Tarihi: ${application.date}
                `);
            }
        });
    });
    
    // Başvuru silme butonları
    document.querySelectorAll('.delete-application').forEach(btn => {
        btn.addEventListener('click', function() {
            const email = this.getAttribute('data-email');
            if (confirm(`${email} başvurusunu silmek istediğinize emin misiniz?`)) {
                let applications = JSON.parse(localStorage.getItem('applications')) || [];
                applications = applications.filter(app => app.email !== email);
                localStorage.setItem('applications', JSON.stringify(applications));
                loadAdminApplications();
            }
        });
    });
}
    function checkApplication() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const applications = JSON.parse(localStorage.getItem('applications')) || [];
        const application = applications.find(app => app.email === currentUser.email);
        
        if (application) {
            applicationInfo.innerHTML = `
                <p><strong>Başvuru Durumu:</strong> Gönderildi</p>
                <p><strong>Başvuru Tarihi:</strong> ${application.date}</p>
            `;
            editApplicationBtn.classList.remove('hidden');
            deleteApplicationBtn.classList.remove('hidden');
            printApplicationBtn.classList.remove('hidden');
        } else {
            applicationInfo.innerHTML = '<p>Henüz başvuru yapılmamış.</p>';
            editApplicationBtn.classList.add('hidden');
            deleteApplicationBtn.classList.add('hidden');
            printApplicationBtn.classList.add('hidden');
        }
    }
});
// ... önceki kodlar aynı ...

// Giriş/Kayıt formu geçişleri
showRegister.addEventListener('click', function(e) {
    e.preventDefault();
    loginForm.style.display = 'none';
    registerForm.style.display = 'flex';
    document.querySelector('#authModal p').textContent = 'Zaten bir hesabınız var mı? ';
    const showLogin = document.createElement('a');
    showLogin.href = '#';
    showLogin.textContent = 'Giriş Yap';
    showLogin.id = 'showLogin';
    document.querySelector('#authModal p').appendChild(showLogin);
    
    showLogin.addEventListener('click', function(e) {
        e.preventDefault();
        registerForm.style.display = 'none';
        loginForm.style.display = 'flex';
        document.querySelector('#authModal p').textContent = 'Hesabınız yok mu? ';
        const showRegisterLink = document.createElement('a');
        showRegisterLink.href = '#';
        showRegisterLink.textContent = 'Kayıt Ol';
        showRegisterLink.id = 'showRegister';
        document.querySelector('#authModal p').appendChild(showRegisterLink);
        
        showRegisterLink.addEventListener('click', function(e) {
            e.preventDefault();
            loginForm.style.display = 'none';
            registerForm.style.display = 'flex';
            document.querySelector('#authModal p').textContent = 'Zaten bir hesabınız var mı? ';
            const showLoginAgain = document.createElement('a');
            showLoginAgain.href = '#';
            showLoginAgain.textContent = 'Giriş Yap';
            showLoginAgain.id = 'showLogin';
            document.querySelector('#authModal p').appendChild(showLoginAgain);
            showLoginAgain.addEventListener('click', e => {
                e.preventDefault();
                registerForm.style.display = 'none';
                loginForm.style.display = 'flex';
                document.querySelector('#authModal p').textContent = 'Hesabınız yok mu? ';
                document.querySelector('#authModal p').appendChild(showRegisterLink);
            });
        });
    });
});

// Dark Mode Fonksiyonu
function initDarkMode() {
    const darkModeToggle = document.createElement('label');
    darkModeToggle.className = 'switch';
    darkModeToggle.innerHTML = `
        <input type="checkbox" id="darkModeToggle">
        <span class="slider"></span>
    `;
    document.querySelector('nav div').prepend(darkModeToggle);
    
    const darkModeToggleCheckbox = document.getElementById('darkModeToggle');
    
    // LocalStorage'dan dark mode durumunu yükle
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
        darkModeToggleCheckbox.checked = true;
    }
    
    // Dark mode toggle event listener
    darkModeToggleCheckbox.addEventListener('change', function() {
        if (this.checked) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('darkMode', 'enabled');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('darkMode', 'disabled');
        }
    });
}

// Sponsor slider için sürükleme özelliği
function initSponsorSliderDrag() {
    const slider = document.querySelector('.sponsors-slider');
    let isDown = false;
    let startX;
    let scrollLeft;

    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        slider.style.cursor = 'grabbing';
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener('mouseleave', () => {
        isDown = false;
        slider.style.cursor = 'grab';
    });

    slider.addEventListener('mouseup', () => {
        isDown = false;
        slider.style.cursor = 'grab';
    });

    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2;
        slider.scrollLeft = scrollLeft - walk;
    });

    // Touch events for mobile
    slider.addEventListener('touchstart', (e) => {
        isDown = true;
        startX = e.touches[0].pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener('touchend', () => {
        isDown = false;
    });

    slider.addEventListener('touchmove', (e) => {
        if (!isDown) return;
        const x = e.touches[0].pageX - slider.offsetLeft;
        const walk = (x - startX) * 2;
        slider.scrollLeft = scrollLeft - walk;
    });
}

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', function() {
    // ... önceki kodlar aynı ...
    
    // Yeni fonksiyonları çağır
    initDarkMode();
    initSponsorSliderDrag();
    
    // Slider için grab cursor
    document.querySelector('.sponsors-slider').style.cursor = 'grab';
});

// ... diğer fonksiyonlar aynı ...
// script.js dosyasında initSponsorSliderDrag fonksiyonunu güncelleyin:

function initSponsorSliderDrag() {
    const slider = document.querySelector('.sponsors-slider');
    let isDown = false;
    let startX;
    let scrollLeft;

    // Mouse ile sürükleme
    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        slider.style.cursor = 'grabbing';
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener('mouseleave', () => {
        isDown = false;
        slider.style.cursor = 'grab';
    });

    slider.addEventListener('mouseup', () => {
        isDown = false;
        slider.style.cursor = 'grab';
    });

    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2;
        slider.scrollLeft = scrollLeft - walk;
    });

    // Touch events for mobile
    slider.addEventListener('touchstart', (e) => {
        isDown = true;
        startX = e.touches[0].pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener('touchend', () => {
        isDown = false;
    });

    slider.addEventListener('touchmove', (e) => {
        if (!isDown) return;
        const x = e.touches[0].pageX - slider.offsetLeft;
        const walk = (x - startX) * 10;
        slider.scrollLeft = scrollLeft - walk;
    });

    // Mouse tekerleği ile kaydırma
    slider.addEventListener('wheel', (e) => {
        e.preventDefault();
        slider.scrollLeft += e.deltaY;
    });

    // Slider için grab cursor
    slider.style.cursor = 'grab';
}
