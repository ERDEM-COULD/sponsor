document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const authModal = document.getElementById('authModal');
    const mainContent = document.getElementById('mainContent');
    const applicationPage = document.getElementById('applicationPage');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const showRegister = document.getElementById('showRegister');
    const showLogin = document.getElementById('showLogin');
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
    const darkModeToggle = document.getElementById('darkModeToggle');
    
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
        if (currentUser.isAdmin) {
            document.getElementById('adminPanelBtn').classList.remove('hidden');
        }
        initDarkMode();
    } else {
        authModal.style.display = 'block';
    }
    
    // Form geçişleri
    showRegister.addEventListener('click', function(e) {
        e.preventDefault();
        toggleAuthForms();
    });
    
    if (showLogin) {
        showLogin.addEventListener('click', function(e) {
            e.preventDefault();
            toggleAuthForms();
        });
    }
    
    function toggleAuthForms() {
        if (loginForm.style.display === 'none') {
            loginForm.style.display = 'flex';
            registerForm.style.display = 'none';
            document.querySelector('#authModal p').textContent = 'Hesabınız yok mu? ';
            const showRegisterLink = document.createElement('a');
            showRegisterLink.href = '#';
            showRegisterLink.textContent = 'Kayıt Ol';
            showRegisterLink.id = 'showRegister';
            document.querySelector('#authModal p').appendChild(showRegisterLink);
            showRegisterLink.addEventListener('click', toggleAuthForms);
        } else {
            loginForm.style.display = 'none';
            registerForm.style.display = 'flex';
            document.querySelector('#authModal p').textContent = 'Zaten bir hesabınız var mı? ';
            const showLoginLink = document.createElement('a');
            showLoginLink.href = '#';
            showLoginLink.textContent = 'Giriş Yap';
            showLoginLink.id = 'showLogin';
            document.querySelector('#authModal p').appendChild(showLoginLink);
            showLoginLink.addEventListener('click', toggleAuthForms);
        }
    }
    
    // Kapatma butonları
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
    
    // Dışarı tıklayarak kapatma
    window.addEventListener('click', function(e) {
        if (e.target === authModal || e.target === settingsModal) {
            e.target.style.display = 'none';
        }
    });
    
    // Giriş formu
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
            location.reload();
            return;
        }
        
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            user.isAdmin = false;
            localStorage.setItem('currentUser', JSON.stringify(user));
            authModal.style.display = 'none';
            mainContent.style.display = 'block';
            loadSponsors();
            checkApplication();
            initDarkMode();
        } else {
            alert('E-posta veya şifre hatalı!');
        }
    });
    
    // Kayıt formu
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
        
        const newUser = { name, email, password, isAdmin: false };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        
        authModal.style.display = 'none';
        mainContent.style.display = 'block';
        loadSponsors();
        initDarkMode();
    });
    
    // Başvuru butonu
    applyBtn.addEventListener('click', function() {
        mainContent.style.display = 'none';
        applicationPage.style.display = 'block';
        alert("DİKKAT! Eğer sözleşmeyi kabul etmediyseniz başvurunuz, sözleşme formu mailimize ulaşana dek kabul edilmeyecek! Sözleşmeyi kabul etmek için https://erdem-could.github.io/Sozlesme");
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const applications = JSON.parse(localStorage.getItem('applications')) || [];
        const userApplication = applications.find(app => app.email === currentUser.email);
        
        if (userApplication) {
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
            document.getElementById('youtube').value = userApplication.socialLinks?.youtube || '';
            document.getElementById('facebook').value = userApplication.socialLinks?.facebook || '';
            document.getElementById('x').value = userApplication.socialLinks?.x || '';
            document.getElementById('instagram').value = userApplication.socialLinks?.instagram || '';
        } else {
            document.getElementById('email').value = currentUser.email;
        }
    });
    
    // Geri butonu
    backBtn.addEventListener('click', function() {
        applicationPage.style.display = 'none';
        mainContent.style.display = 'block';
    });
    
    // Ayarlar butonu
    settingsBtn.addEventListener('click', function() {
        settingsModal.style.display = 'block';
        
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        document.getElementById('editName').value = currentUser.name;
        document.getElementById('editEmail').value = currentUser.email;
    });
    
    // Çıkış butonu
    logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('currentUser');
        location.reload();
    });
    
    // Hesap ayarları formu
    accountForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        const name = document.getElementById('editName').value || currentUser.name;
        const email = document.getElementById('editEmail').value || currentUser.email;
        const password = document.getElementById('editPassword').value || currentUser.password;
        
        const userIndex = users.findIndex(u => u.email === currentUser.email);
        if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], name, email, password };
            localStorage.setItem('users', JSON.stringify(users));
        }
        
        const updatedUser = { name, email, password, isAdmin: currentUser.isAdmin };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        
        alert('Bilgileriniz güncellendi!');
        settingsModal.style.display = 'none';
    });
    
    // Başvuru formu
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
            date: new Date().toLocaleDateString(),
            socialLinks: {
                youtube: document.getElementById('youtube').value,
                facebook: document.getElementById('facebook').value,
                x: document.getElementById('x').value,
                instagram: document.getElementById('instagram').value
            }
        };
        
        let applications = JSON.parse(localStorage.getItem('applications')) || [];
        applications = applications.filter(app => app.email !== currentUser.email);
        applications.push(application);
        localStorage.setItem('applications', JSON.stringify(applications));
        
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
            YouTube: ${application.socialLinks.youtube || 'Yok'}%0D%0A
            Facebook: ${application.socialLinks.facebook || 'Yok'}%0D%0A
            X: ${application.socialLinks.x || 'Yok'}%0D%0A
            Instagram: ${application.socialLinks.instagram || 'Yok'}%0D%0A
            Yorumlar: ${application.comments || 'Yok'}%0D%0A
            E-posta: ${application.email}%0D%0A
            Başvuru Tarihi: ${application.date}
        `;
        
        window.location.href = mailtoLink;
        applicationPage.style.display = 'none';
        mainContent.style.display = 'block';
        checkApplication();
    });
    
    // Tab butonları
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(`${tabId}Tab`).classList.add('active');
        });
    });
    
    // Başvuru düzenleme
    editApplicationBtn.addEventListener('click', function() {
        settingsModal.style.display = 'none';
        mainContent.style.display = 'none';
        applicationPage.style.display = 'block';
    });
    
    // Başvuru silme
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
    
    // Başvuru yazdırma
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
                            .social-links { margin-top: 15px; }
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
                        
                        <div class="social-links">
                            <p><strong>Sosyal Medya Bağlantıları:</strong></p>
                            <div class="info-item"><span class="label">YouTube:</span> ${application.socialLinks?.youtube || 'Yok'}</div>
                            <div class="info-item"><span class="label">Facebook:</span> ${application.socialLinks?.facebook || 'Yok'}</div>
                            <div class="info-item"><span class="label">X:</span> ${application.socialLinks?.x || 'Yok'}</div>
                            <div class="info-item"><span class="label">Instagram:</span> ${application.socialLinks?.instagram || 'Yok'}</div>
                        </div>
                        
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
    
    // Slider navigasyon
    document.querySelector('.prev').addEventListener('click', function() {
        sponsorsSlider.scrollBy({ left: -300, behavior: 'smooth' });
    });
    
    document.querySelector('.next').addEventListener('click', function() {
        sponsorsSlider.scrollBy({ left: 300, behavior: 'smooth' });
    });
    
    // Dark Mode
    function initDarkMode() {
        if (localStorage.getItem('darkMode') === 'enabled') {
            document.body.classList.add('dark-mode');
            darkModeToggle.checked = true;
        }
        
        darkModeToggle.addEventListener('change', function() {
            if (this.checked) {
                document.body.classList.add('dark-mode');
                localStorage.setItem('darkMode', 'enabled');
            } else {
                document.body.classList.remove('dark-mode');
                localStorage.setItem('darkMode', 'disabled');
            }
        });
    }
    
    // Sponsor Yükleme Fonksiyonu
    function loadSponsors() {
        const sponsors = [
            {
                name: "Animatronik",
                description: "Korku 3d tasarımında 1.sırada",
                website: "https://Yok",
                imageFile: "logo.jpg",
                social: {
                    youtube: "https://youtube.com/@tavsanmc?si=0_Rg1_tu-oQVVfNj",
                    facebook: "",
                    x: "",
                    instagram: ""
                }
            },
            
            
            }
        ];
        
        sponsorsSlider.innerHTML = '';
        
        sponsors.forEach(sponsor => {
            const card = document.createElement('div');
            card.className = 'sponsor-card';
            card.innerHTML = `
                <img src="${sponsor.imageFile}" alt="${sponsor.name}"
                     onerror="this.onerror=null; this.src='https://via.placeholder.com/300x150?text=${sponsor.name.replace(' ', '+')}'">
                <h3>${sponsor.name}</h3>
                <p>${sponsor.description}</p>
                <div class="social-links">
                    ${sponsor.social.youtube ? `<a href="${sponsor.social.youtube}" class="youtube" target="_blank"><i>YouTube</i></a>` : ''}
                    ${sponsor.social.facebook ? `<a href="${sponsor.social.facebook}" class="facebook" target="_blank"><i>Facebook</i></a>` : ''}
                    ${sponsor.social.x ? `<a href="${sponsor.social.x}" class="x" target="_blank"><i>X</i></a>` : ''}
                    ${sponsor.social.instagram ? `<a href="${sponsor.social.instagram}" class="instagram" target="_blank"><i>Instagram</i></a>` : ''}
                </div>
            `;
            card.addEventListener('click', (e) => {
                if (e.target === card || e.target.tagName === 'H3' || e.target.tagName === 'P' || e.target.tagName === 'IMG') {
                    window.open(sponsor.website, '_blank');
                }
            });
            sponsorsSlider.appendChild(card);
        });
        
        initSponsorSliderDrag();
    }

    // Sponsor slider sürükleme
    function initSponsorSliderDrag() {
        let isDown = false;
        let startX;
        let scrollLeft;

        sponsorsSlider.addEventListener('mousedown', (e) => {
            isDown = true;
            sponsorsSlider.style.cursor = 'grabbing';
            startX = e.pageX - sponsorsSlider.offsetLeft;
            scrollLeft = sponsorsSlider.scrollLeft;
        });

        sponsorsSlider.addEventListener('mouseleave', () => {
            isDown = false;
            sponsorsSlider.style.cursor = 'grab';
        });

        sponsorsSlider.addEventListener('mouseup', () => {
            isDown = false;
            sponsorsSlider.style.cursor = 'grab';
        });

        sponsorsSlider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - sponsorsSlider.offsetLeft;
            const walk = (x - startX) * 2;
            sponsorsSlider.scrollLeft = scrollLeft - walk;
        });

        // Touch events
        sponsorsSlider.addEventListener('touchstart', (e) => {
            isDown = true;
            startX = e.touches[0].pageX - sponsorsSlider.offsetLeft;
            scrollLeft = sponsorsSlider.scrollLeft;
        });

        sponsorsSlider.addEventListener('touchend', () => {
            isDown = false;
        });

        sponsorsSlider.addEventListener('touchmove', (e) => {
            if (!isDown) return;
            const x = e.touches[0].pageX - sponsorsSlider.offsetLeft;
            const walk = (x - startX) * 2;
            sponsorsSlider.scrollLeft = scrollLeft - walk;
        });

        // Mouse tekerleği
        sponsorsSlider.addEventListener('wheel', (e) => {
            e.preventDefault();
            sponsorsSlider.scrollLeft += e.deltaY;
        });
    }

    // Başvuru kontrolü
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

    // Admin paneli
    function initAdminPanel() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser || !currentUser.isAdmin) return;

        const adminBtn = document.getElementById('adminPanelBtn');
        adminBtn.classList.remove('hidden');

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

        adminBtn.addEventListener('click', () => {
            adminModal.style.display = 'block';
            loadAdminUsers();
            loadAdminApplications();
        });

        adminModal.querySelector('.close').addEventListener('click', () => {
            adminModal.style.display = 'none';
        });

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
    }

    // Admin kullanıcıları yükle
    function loadAdminUsers() {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const tbody = document.querySelector('#usersTable tbody');
        tbody.innerHTML = '';
        
        users.forEach(user => {
            if (user.email !== "merdem58171.3@gmail.com") {
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

    // Admin başvuruları yükle
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
        
        document.querySelectorAll('.view-application').forEach(btn => {
            btn.addEventListener('click', function() {
                const email = this.getAttribute('data-email');
                const applications = JSON.parse(localStorage.getItem('applications')) || [];
                const application = applications.find(app => app.email === email);
                
                if (application) {
                    let socialLinks = '';
                    if (application.socialLinks) {
                        socialLinks = `
                            <p><strong>Sosyal Medya:</strong></p>
                            <p>YouTube: ${application.socialLinks.youtube || 'Yok'}</p>
                            <p>Facebook: ${application.socialLinks.facebook || 'Yok'}</p>
                            <p>X: ${application.socialLinks.x || 'Yok'}</p>
                            <p>Instagram: ${application.socialLinks.instagram || 'Yok'}</p>
                        `;
                    }
                    
                    alert(`
                        İsim: ${application.firstName} ${application.lastName}
                        Telefon: ${application.phone}
                        ${socialLinks}
                        Şirket: ${application.company}
                        Başvuru Tarihi: ${application.date}
                    `);
                }
            });
        });
        
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

    // Sayfa yüklendiğinde çalıştırılacak fonksiyonlar
    if (currentUser) {
        initAdminPanel();
        initSponsorSliderDrag();
    }
});
