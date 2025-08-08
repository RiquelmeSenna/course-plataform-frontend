let emailInput = document.getElementsByName('email')[0]
let passwordInput = document.getElementsByName('password')[0]
let buttonLogin = document.querySelector('#btn-login')

buttonLogin.addEventListener('click', async () => {
    let url = 'https://course-plataform-backend.onrender.com/auth/signin'

    let dadosDoUsuario = {
        email: emailInput.value,
        password: passwordInput.value
    }
    try {
        let login = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosDoUsuario)
        })

        let response = await login.json()
        let error = document.querySelectorAll('.error')

        if (response.token) {
            localStorage.setItem('token', response.token)
            window.location.replace('../home/initial.html')
            console.log(response)
        } else if (response.error.email) {
            console.log(response)
            error[0].style.display = 'block'
            error[0].innerHTML = response.error.email
            error[1].style.display = 'none'
        } else {
            console.log(response)
            error[1].style.display = 'block'
            error[1].innerHTML = response.error.password
            error[0].style.display = 'none'
        }
    } catch (error) {

    }
})
