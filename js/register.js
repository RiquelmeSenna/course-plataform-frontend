let nameInput = document.getElementsByName('name')[0]
let emailInput = document.getElementsByName('email')[0]
let cpfInput = document.getElementsByName('cpf')[0]
let passwordInput = document.getElementsByName('password')[0]
let button = document.querySelector('#btn-register')



button.addEventListener('click', async () => {
    let url = 'https://course-plataform-backend.onrender.com/auth/signup'

    let dadosDoUsuario = {
        cpf: cpfInput.value,
        email: emailInput.value,
        name: nameInput.value,
        password: passwordInput.value,
        type: 'Student'
    }

    try {
        let register = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosDoUsuario)
        })

        let response = await register.json()
        let error = document.querySelectorAll('.error')

        if (response.user) {
            window.location.replace('../index.html')
        } else if (response.error.password) {
            error[3].style.display = 'block'
            error[3].innerHTML = response.error.password[0]
            error[0].style.display = 'none'
            error[1].style.display = 'none'
            error[2].style.display = 'none'
            error[4].style.display = 'none'
        } else if (response.error.email) {
            error[1].style.display = 'block'
            error[1].innerHTML = response.error.email[0]
            error[0].style.display = 'none'
            error[3].style.display = 'none'
            error[2].style.display = 'none'
            error[4].style.display = 'none'
        } else if (response.error.name) {
            error[0].style.display = 'block'
            error[0].innerHTML = response.error.name[0]
            error[1].style.display = 'none'
            error[3].style.display = 'none'
            error[2].style.display = 'none'
            error[4].style.display = 'none'
        } else if (response.error.cpf) {
            error[2].style.display = 'block'
            error[2].innerHTML = response.error.cpf[0]
            error[1].style.display = 'none'
            error[3].style.display = 'none'
            error[0].style.display = 'none'
            error[4].style.display = 'none'
        } else {
            error[4].style.display = 'block'
            error[4].innerHTML = 'Usuario existente!'
            error[4].style.fontSize = '20px'
            error[1].style.display = 'none'
            error[3].style.display = 'none'
            error[2].style.display = 'none'
            error[0].style.display = 'none'
        }



    } catch (error) {

    }
})