// Seleção dos inputs customizados (formation, ocupation)
const customInputs = document.querySelectorAll('.customInput');

document.querySelectorAll('.input-button').forEach(btn => {
    btn.addEventListener('click', () => {
        if (btn.name === "ageBtn") {
            const selected = document.querySelector('.selectedAge');
            if (selected) selected.classList.remove('selectedAge');
            btn.classList.add('selectedAge');
            document.getElementById('ageValue').value = btn.value; // <-- hidden atualizado
        } else if (btn.name === "genderBtn") {
            const selected = document.querySelector('.selectedGender');
            if (selected) selected.classList.remove('selectedGender');
            btn.classList.add('selectedGender');
            document.getElementById('genderValue').value = btn.value; // <-- hidden atualizado
        }
        validarFormulario();
    });
});

// Dropdown customizado
customInputs.forEach(input => {
    const options = input.parentElement.nextElementSibling; 
    
    input.addEventListener('click', () => {
        options.style.display = options.style.display === 'block' ? 'none' : 'block';
    });

    options.querySelectorAll('.option').forEach(option => {
        option.addEventListener('click', () => {
            input.value = option.textContent;
            options.style.display = 'none';
            validarFormulario(); // chama validação sempre que escolhe
        });
    });
});

// Fecha dropdown se clicar fora
document.addEventListener('click', function(event) {
    if (!event.target.closest('.form-group') && !event.target.closest('.options')) {
        document.querySelectorAll('.options').forEach(opt => opt.style.display = 'none');
    }
});

// Botões de idade e gênero
const buttons = document.querySelectorAll('.input-button');
buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        if(btn.name === "age") {
            const selected = document.querySelector('.selectedAge');
            if (selected) selected.classList.remove('selectedAge');
            btn.classList.add('selectedAge');
            console.log(document.getElementById('ageValue'))
            document.getElementById('ageValue').value = btn.value; // <-- hidden atualizado
        } else if(btn.name === "gender") {
            const selected = document.querySelector('.selectedGender');
            if (selected) selected.classList.remove('selectedGender');
            btn.classList.add('selectedGender');
            console.log(document.getElementById('genderValue'))
            document.getElementById('genderValue').value = btn.value; // <-- hidden atualizado
        }
        validarFormulario();
    });
});

// Função para verificar se todos os campos foram preenchidos
function validarFormulario() {
    const nome = document.getElementById('name').value.trim();
    const lastName = document.getElementById('lastname').value.trim();

    // checa se todos os customInput têm valor
    let emptyCustoms = false;
    customInputs.forEach(input => {
        if (input.value.trim() === "") {
            emptyCustoms = true;
        }
    });

    // regras: nome, sobrenome, formação, ocupação, idade, gênero
    if (nome !== "" && lastName !== "" && !emptyCustoms &&
        document.querySelector('.selectedAge') &&
        document.querySelector('.selectedGender')) {
        document.getElementById("block").classList.remove('block'); // remove bloqueio
    } else {
        document.getElementById("block").classList.add('block'); // mantém bloqueio
    }
}

// validação nos campos de texto (nome e sobrenome)
document.querySelectorAll('#name, #lastname').forEach(input => {
    input.addEventListener('input', validarFormulario);
});