/**
 * league.js
 */

let lb_anim = false;
let lb_title = document.querySelector('.lb-title');
let lb_items = document.querySelector('.lb-items');

let items = [];

let scroller = 0;

function reload() {
    let url = '/times/' + league;
    $.ajax({
        url: url,
        type: 'get',
        success: function (res, status) {
            if (res) {
                reloaded(res);
            }
        }
    });
}

function reloaded(res) {
    let isNew = false;
    if (items.length > 0 && items.length < res.items.length) {
        isNew = true;
    }

    let rank;
    let racerName;
    let lapTime;

    res.items.sort(compare);

    for (let i = 0; i < items.length; i++) {
        if (items[i].racerName !== res.items[i].racerName || items[i].lapTime !== res.items[i].lapTime) {
            rank = i + 1;
            racerName = res.items[i].racerName;
            lapTime = res.items[i].lapTime;
            break;
        }
    }

    if (isNew && !racerName) {
        let j = res.items.length - 1;
        rank = res.items.length;
        racerName = res.items[j].racerName;
        lapTime = res.items[j].lapTime;
    }

    if (items.length == 0 || racerName || items.length != res.items.length) {
        print(res);
    }

    if (racerName) {
        console.log(`new ${isNew} ${rank} ${racerName} ${lapTime}`);

        scroll(rank);

        if (isNew) {
            popup('New Challenger!', rank, racerName, lapTime);
        } else {
            popup('New Record!', rank, racerName, lapTime);
        }
    }

    items = res.items;
}

function print(res) {
    lb_anim = res.anim;

    clear(res.logo, res.title);

    addRow('lb-header', 'Rank', 'Name', 'Time')

    let rank = 0;
    res.items.forEach(function (item) {
        rank++;
        addRow('lb-row', rank, item.racerName, item.lapTime);
    });
}

function compare(a, b) {
    a2 = sec(a.lapTime);
    b2 = sec(b.lapTime);
    if (a2 < b2) {
        return -1;
    } else if (a2 > b2) {
        return 1;
    }
    return 0;
}

function sec(t) {
    let a = t.split(':');
    return ((+a[0]) * 60) + (+a[1]);
}

function clear(logo, title) {
    if (logo && logo !== '') {
        document.querySelector('.lb-logo-front').innerHTML = `<img src="${logo}">`;
        document.querySelector('.lb-logo-back').innerHTML = `<img src="${logo}">`;
    }

    document.title = title
    lb_title.innerText = title;

    while (lb_items.lastChild) {
        lb_items.removeChild(lb_items.lastChild);
    }
}

function addRow(className, rank, racerName, lapTime) {
    let row = document.createElement('div');
    row.classList.add(className);
    row.classList.add(`lb-rank${rank}`);
    if (rank > 0 && rank < 4) {
        addText(row, `<img src="/icon-trophy.png" class="icon-trophy"> ${rank}`);
    } else {
        addText(row, rank);
    }
    addText(row, racerName);
    addText(row, lapTime);
    lb_items.appendChild(row);
}

function addText(row, text) {
    let item = document.createElement('div');
    item.innerHTML = `<span>${text}</span>`;
    row.appendChild(item);
}

let socket = io();
socket.on('league', function (name) {
    console.log(`socket league ${name}`);
    reload();
});

$(function () {
    reload();
    setInterval(function () {
        reload();
    }, 10000);

    setInterval(function () {
        scroller--;
        if (scroller == 0) {
            scroll('up');
        }
        if (scroller < -120) {
            scroll('down');
        }
    }, 1000);
});

function scroll(dir) {
    let scrollTop = 0;
    let duration = 1000;
    let max = 5;

    if (dir === 'up') {
        scrollTop = 0;
        duration = 1000;
        scroller = 0;
    } else if (dir === 'down') {
        dir = items.length;
        if (dir <= max) {
            return;
        }
        if (dir > 100) {
            dir = 100;
        }
        dir = dir - max;
        scrollTop = $(`.lb-rank${dir}`).offset().top;
        duration = dir * 600;
        scroller = parseInt(duration / 1000);
    } else {
        if (dir <= max) {
            return;
        }
        dir = dir - max;
        scrollTop = $(`.lb-rank${dir}`).offset().top;
        scroller = 20;
    }

    $('html, body').stop().animate({
        scrollTop: scrollTop
    }, duration);
}

function popup(title, rank, racer, time) {
    let pop_title = document.querySelector('.pop-title');
    let pop_racer = document.querySelector('.pop-racer');
    let pop_time = document.querySelector('.pop-time');

    pop_title.innerText = title;
    pop_racer.innerText = racer;
    pop_racer.classList.add(`pop-rank${rank}`);
    pop_time.innerText = time;

    // scroll
    scroll(rank);

    // logo
    if (lb_anim) {
        $('.pop-logo').fadeIn();
        $('.pop-logo .pop-container').animate({
            height: '100%'
        }, 1200);
        setTimeout(function () {
            $('.pop-logo').fadeOut();
            setTimeout(function () {
                $('.pop-logo .pop-container').animate({
                    height: '200px'
                }, 100);
            }, 1000);
        }, 1000);
    }

    confetti.start(5000);

    // layer
    setTimeout(function () {
        $('.pop-layer').fadeIn();

        setTimeout(function () {
            $('.pop-layer').fadeOut();

            $(`.lb-rank${rank}>div:nth-child(n+2) span`).fadeOut().fadeIn().fadeOut().fadeIn();

            pop_title.innerText = '';
            pop_racer.innerText = '';
            pop_racer.classList.remove(`pop-rank${rank}`);
            pop_time.innerText = '';
        }, 7000);
    }, 1000);
}
