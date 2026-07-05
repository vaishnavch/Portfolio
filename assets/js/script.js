if (typeof emailjs !== 'undefined') {
    emailjs.init("user_TTDmetQLYgWCLzHTDgqxm");
}

$(document).ready(function () {

    $('#menu').click(function () {
        $(this).toggleClass('fa-times');
        $('.navbar').toggleClass('nav-toggle');
    });

    $(window).on('scroll load', function () {
        $('#menu').removeClass('fa-times');
        $('.navbar').removeClass('nav-toggle');

        if (window.scrollY > 60) {
            document.querySelector('#scroll-top').classList.add('active');
        } else {
            document.querySelector('#scroll-top').classList.remove('active');
        }

        // scroll spy — only update active when a matching hash-anchor exists in the nav
        $('section').each(function () {
            let height = $(this).height();
            let offset = $(this).offset().top - 200;
            let top = $(window).scrollTop();
            let id = $(this).attr('id');

            if (top > offset && top < offset + height) {
                const hashLink = $('.navbar').find(`[href="#${id}"]`);
                if (hashLink.length) {
                    $('.navbar ul li a').removeClass('active');
                    hashLink.addClass('active');
                }
            }
        });
    });

    function showToast(message) {
        let toast = document.getElementById('copy-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'copy-toast';
            toast.className = 'copy-toast';
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.classList.add('show');
        clearTimeout(toast._timer);
        toast._timer = setTimeout(() => toast.classList.remove('show'), 2200);
    }

    function copyEmailToClipboard(email) {
        if (!email) return;
        navigator.clipboard.writeText(email).then(function () {
            showToast('Email copied to clipboard!');
        }, function () {
            showToast('Copy failed — email: ' + email);
        });
    }

    $('.copy-email-icon, .copy-email').on('click', function (e) {
        e.preventDefault();
        const email = $(this).data('email');
        copyEmailToClipboard(email);
    });

    // smooth scrolling — same-page hash links only
    $('a[href*="#"]').on('click', function (e) {
        const href = $(this).attr('href');
        if (!href.startsWith('#')) return;
        e.preventDefault();
        if (href === '#') {
            $('html, body').animate({ scrollTop: 0 }, 500, 'linear');
            return;
        }
        const target = $(href);
        if (!target.length) return;
        $('html, body').animate({
            scrollTop: target.offset().top - $('header').outerHeight(),
        }, 500, 'linear');
    });

    if (document.getElementById("contact-form")) {
        $("#contact-form").submit(function (event) {
            event.preventDefault();
            var $btn = $(this).find('button[type="submit"]');
            $btn.prop('disabled', true).html('Sending... <i class="fa fa-spinner fa-spin"></i>');

            emailjs.sendForm('contact_service', 'template_contact', '#contact-form')
                .then(function () {
                    document.getElementById("contact-form").reset();
                    $btn.prop('disabled', false).html('Submit <i class="fa fa-paper-plane"></i>');
                    alert("Message sent successfully! I'll get back to you soon.");
                }, function (error) {
                    console.error('EmailJS error:', error);
                    $btn.prop('disabled', false).html('Submit <i class="fa fa-paper-plane"></i>');
                    alert("Failed to send message. Please try again or email me directly at vaishnav@tamu.edu");
                });
        });
    }

});

const _originalTitle = document.title;
document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === "visible") {
        document.title = _originalTitle;
        $("#favicon").attr("href", "assets/images/AREmoji_Square.jpg");
    } else {
        document.title = "Come Back To Portfolio";
        $("#favicon").attr("href", "assets/images/favhand.png");
    }
});

if (document.querySelector(".typing-text")) {
    var typed = new Typed(".typing-text", {
        strings: ["A Packaging Engineer", "A Mechanical Engineer", "A Programmer", "A Product Designer", "An Innovator", "A Tinkerer"],
        loop: true,
        typeSpeed: 50,
        backSpeed: 25,
        backDelay: 500,
    });
}

async function fetchData(type = "skills") {
    let response;
    type === "skills" ?
        response = await fetch("skills.json")
        :
        response = await fetch("./projects/projects.json");
    const data = await response.json();
    return data;
}

function showSkills(skills) {
    let skillsContainer = document.getElementById("skillsContainer");
    let skillHTML = "";
    skills.forEach(skill => {
        skillHTML += `
        <div class="bar">
              <div class="info">
                <img src=${skill.icon} alt="skill" />
                <span>${skill.name}</span>
              </div>
            </div>`;
    });
    skillsContainer.innerHTML = skillHTML;
}

function showProjects(projects) {
    let projectsContainer = document.querySelector("#work .box-container");
    let projectHTML = "";
    projects.filter(project => project.category != "android").forEach(project => {
        projectHTML += `
        <div class="box tilt">
        <img draggable="false" src="/assets/images/projects/${project.image}.png" alt="project" />
        <div class="content">
        <div class="tag">
        <h3>${project.name}</h3>
        </div>
        <div class="desc">
          <p>${project.desc}</p>
          <div class="btns">
            <a href="${project.links.view}" class="btn" target="_blank"><i class="fas fa-eye"></i> View</a>
            <a href="${project.links.code}" class="btn" target="_blank">Code <i class="fas fa-code"></i></a>
          </div>
        </div>
      </div>
    </div>`;
    });
    projectsContainer.innerHTML = projectHTML;

    VanillaTilt.init(document.querySelectorAll(".tilt"), { max: 15 });

    const srtop = ScrollReveal({
        origin: 'top',
        distance: '80px',
        duration: 1000,
        reset: true
    });
    srtop.reveal('.work .box', { interval: 200 });
}

if (document.getElementById("skillsContainer")) {
    fetchData().then(data => { showSkills(data); });
}

if (document.querySelector("#work .box-container")) {
    fetchData("projects").then(data => { showProjects(data); });
}

if (document.querySelectorAll(".tilt").length) {
    VanillaTilt.init(document.querySelectorAll(".tilt"), { max: 15 });
}

document.onkeydown = function (e) {
    if (e.keyCode == 123) { return false; }
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) { return false; }
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) { return false; }
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) { return false; }
    if (e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) { return false; }
};

const srtop = ScrollReveal({
    origin: 'top',
    distance: '80px',
    duration: 1000,
    reset: true
});

srtop.reveal('.home .content h3', { delay: 200 });
srtop.reveal('.home .content p', { delay: 200 });
srtop.reveal('.home .content .btn', { delay: 200 });
srtop.reveal('.home .image', { delay: 400 });
srtop.reveal('.home .linkedin', { interval: 800 });
srtop.reveal('.home .github', { interval: 800 });
srtop.reveal('.home .scholar', { interval: 800 });
srtop.reveal('.home .mailto', { interval: 800 });

srtop.reveal('.about .content h3', { delay: 200 });
srtop.reveal('.about .content .tag', { delay: 200 });
srtop.reveal('.about .content p', { delay: 200 });
srtop.reveal('.about .content .box-container', { delay: 200 });
srtop.reveal('.about .content .resumebtn', { delay: 200 });

srtop.reveal('.skills .container', { interval: 200 });
srtop.reveal('.skills .container .bar', { delay: 400 });

srtop.reveal('.education .box', { interval: 200 });

srtop.reveal('.work .box', { interval: 200 });

srtop.reveal('.experience .timeline', { delay: 400 });
srtop.reveal('.experience .timeline .container', { interval: 400 });

srtop.reveal('.contact .container', { delay: 400 });
srtop.reveal('.contact .container .form-group', { delay: 400 });
