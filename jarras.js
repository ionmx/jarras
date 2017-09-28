var MAX_A      = 3;
var MAX_B      = 5;
var search_key = 'b';
var search_val = 4;

var states     = {};
var discovered = {};
var found      = false;

var jarra_max_height = 250;
var liter_height = 0;

function assign_state(key, na, nb, msg) {
  new_key = na + '-' + nb;
  states[key][new_key] = {};
  states[key][new_key]['a'] = na;
  states[key][new_key]['b'] = nb;
  states[key][new_key]['msg'] = msg;
  create_state(na, nb);
}

function create_state(a, b) {
  var key = a + '-' + b;
  var na = 0;
  var nb = 0;
  var needs_to_fill = 0;

  if (!(key in states)) {
  	states[key] = {};
  } else {
  	return; 
  }

  // Fill 
  if (a < MAX_A) {
    na = MAX_A; 
    nb = b;
    assign_state(key, na, nb, 'Llenar jarra A');
  }
  if (b < MAX_B) {
    na = a; 
    nb = MAX_B;
    assign_state(key, na, nb, 'Llenar jarra B');
  }

  // A -> B
  if (b < MAX_B && a > 0) {
    needs_to_fill = MAX_B - b;
    if (needs_to_fill > a) {
      na = 0;
      nb = b + a;
    } else {
      na = a - needs_to_fill;
      nb = b + needs_to_fill;
    }
    assign_state(key, na, nb, 'Pasar ' + needs_to_fill + ' de A a B');
  }

  // B -> A
  if (a < MAX_A && b > 0) {
    needs_to_fill = MAX_A - a;
    if (needs_to_fill > b) {
      na = a + b;
      nb = 0;
    } else {
      na = a + needs_to_fill;
      nb = b - needs_to_fill;
    }
    assign_state(key, na, nb, 'Pasar ' + needs_to_fill + ' de B a A');
  }

  // Empty
  if (a > 0) {
    na = 0; 
    nb = b;
    assign_state(key, na, nb, 'Vaciar A');
  }
  if (b > 0) {
    na = a; 
    nb = 0;
    assign_state(key, na, nb, 'Vaciar B');
  }
}

function dfs(st, prev_state) {
  if (found) return;
  discovered[st] = st;
  if (prev_state != '') {
    discovered[st] = '[' + st + '] ' + states[prev_state][st]['msg'];
  } else {
    discovered[st] = '[' + st + '] Inicia con Jarra A: ' + st[0] + ' y Jarra B: ' + st[2];
  }
  prev_state = st;
  
  for (var key in states[st]) {
  	if (!(key in discovered)) {
  	  if (states[st][key][search_key] == search_val) {
  	    discovered[key] = '[' + key + '] ' + states[st][key]['msg'];
  	    found = true;
  	    break;
      } else {
      	dfs(key, prev_state);
      }
  	} 
  }
}


function update_jarras(a, b) {
  var liq_a = document.getElementById("liquido-a");
  var liq_b = document.getElementById("liquido-b");
  var h = a * liter_height;
  liq_a.setAttribute('y', jarra_max_height - h);
  liq_a.setAttribute('height',h);

  h = b * liter_height;
  liq_b.setAttribute('y', jarra_max_height - h);
  liq_b.setAttribute('height',h);
}

function initialize_jarras() {

  if (MAX_A > MAX_B) {
    liter_height = jarra_max_height / MAX_A;
  } else {
    liter_height = jarra_max_height / MAX_B;
  }

  // JARRA A
  var borde = document.getElementById("borde-a");
  var mango1 = document.getElementById("mango1-a");
  var mango2 = document.getElementById("mango2-a");
  var jarra_height =  MAX_A * liter_height;
  borde.setAttribute('height', jarra_height);
  borde.setAttribute('y', jarra_max_height - jarra_height);
  mango1.setAttribute('height',  jarra_height * 0.6);
  mango1.setAttribute('y', jarra_max_height - jarra_height + 20);
  mango2.setAttribute('height',  jarra_height * 0.6 - 20);
  mango2.setAttribute('y', jarra_max_height - jarra_height + 30);

  
  // JARRA B
  var borde = document.getElementById("borde-b");
  var mango1 = document.getElementById("mango1-b");
  var mango2 = document.getElementById("mango2-b");
  var jarra_height =  MAX_B * liter_height;
  borde.setAttribute('height', jarra_height);
  borde.setAttribute('y', jarra_max_height - jarra_height);
  mango1.setAttribute('height',  jarra_height * 0.6);
  mango1.setAttribute('y', jarra_max_height - jarra_height + 20);
  mango2.setAttribute('height',  jarra_height * 0.6 - 20);
  mango2.setAttribute('y', jarra_max_height - jarra_height + 30); 

  update_log('Inicializar jarras: A es de ' + MAX_A +' litros y B es de ' + MAX_B + ' litros');
}

function update_log(msg) {
	document.getElementById('log').innerHTML += msg + '<br/>'; 
}

function show_solution() {
  var steps = []
  var item = {}
  for (var key in discovered) {
    //alert(JSON.stringify(discovered[key], null, 4));
    steps.push(discovered[key]);
  }
  show_step(steps);
}

function show_step(steps) {
  s = steps.shift();
  if (typeof s !== 'undefined') {
  	update_log(s);
  	update_jarras(s[1], s[3]);
  	setTimeout(function() {
      show_step(steps);
    }, 1000);	
  } else {
  	update_log('¡Encontrado!');
  }
}

create_state(0, 0);
initialize_jarras();
dfs('0-0', '');
update_log ('Buscando ' + search_val + ' en jarra ' + search_key);
show_solution();


