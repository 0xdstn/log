if('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
};

const body = document.getElementById('body');
const about = document.getElementById('about');
const entriesRender = document.getElementById('entries');
const openAbout = document.getElementById('open-about');
const closeAbout = document.getElementById('close-about');
const entryInput = document.getElementById('entry');
const glyphInput = document.getElementById('glyph');
const saveButton = document.getElementById('save');
const undoButton = document.getElementById('undo');

const glyphs = {
    '-' : 'note',
    '.' : 'task',
    'o' : 'event',
    'x' : 'done'
};

var editing = false;
var editingIndex = null;
var lastDeleted = '';
var entries = '';
var l = localStorage.getItem('log');
if(l !== null) {
    entries = l;
}

openAbout.addEventListener('click',function(e) {
    e.preventDefault();
    about.classList.add('open');
    body.classList.add('modalOpen');
});

closeAbout.addEventListener('click',function(e) {
    e.preventDefault();
    about.classList.remove('open');
    body.classList.remove('modalOpen');
});

undoButton.addEventListener('click',function(e) {
    e.preventDefault();

    var sep = '|';
    if(entries == '') {
        sep = '';
    }
    entries += sep + lastDeleted;
    lastDeleted = '';
    undoButton.style.display = 'none';
    localStorage.setItem('log',entries);
    renderLogs();
});

saveButton.addEventListener('click',function(e) {
    e.preventDefault();
    var newEntry = `${glyphInput.value} ${entryInput.value}`;
    if(editing) {
        var items = entries.split('|');
        items[editingIndex] = newEntry;
        entries = items.join('|');
        editing = false;
        editingIndex = null;
    } else {
        var sep = '|';
        if(entries == '') {
            sep = '';
        }
        entries += sep + newEntry;
    }
    localStorage.setItem('log',entries);
    entryInput.value = '';
    glyphInput.value = '-';
    renderLogs();
});

function renderLogs() {
    var out = '';

    if(entries.length) {
        var items = entries.split('|');

        items.forEach((i,index) => {
            var glyph = i[0];
            var entry = i.substring(2);
            out += `<a href="#" data-action="del" data-i="${index}">D</a> <a href="#"  data-action="edit" data-i="${index}">E</a> <span class="${glyphs[glyph]}">${glyph}</span> ${entry}<br>`;
        });
    }

    entriesRender.innerHTML = out;

    document.querySelectorAll('#entries a').forEach(btn => {
        btn.addEventListener('click',function(e){
            e.preventDefault();
            var action = e.target.getAttribute('data-action');
            var i = e.target.getAttribute('data-i');

            if(action == 'del') {
                var items = entries.split('|');
                lastDeleted = items[i];
                undoButton.style.display = 'block';
                items.splice(i,1);
                entries = items.join('|');
                localStorage.setItem('log',entries);
                renderLogs();
            } else if(action == 'edit') {
                var items = entries.split('|');
                var item = items[i];
                var glyph = item[0];
                var entry = item.substring(2);
                entryInput.value = entry;
                glyphInput.value = glyph;
                editing = true;
                editingIndex = parseInt(i);
            }
        });
    });
}

renderLogs();
