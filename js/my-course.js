const token = localStorage.getItem('token')
let userName = document.querySelector('#user p')
let explore = document.querySelector('.explore')
let categoriesDiv = document.querySelector('.categories')
let categoriesList = document.querySelector('.categories ul')
let userDiv = document.querySelector('#user')
let studentPanel = document.querySelector('#student-panel')
let teacherPanel = document.querySelector("#teacher-panel")
let logout = document.querySelector('#logout')

userDiv.addEventListener('click', () => {
    window.location.replace('../../pages/home/user.html')
})

async function changeName() {
    const url = 'https://plataforma-de-curso.onrender.com/users/me'

    const user = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })

    const response = await user.json()
    userName.innerHTML = response.user.name
    if (response.user.type == 'Teacher') {
        let bottomCreate = document.querySelector('#create-course')
        bottomCreate.style.display = 'block'
        studentPanel.style.display = 'none'
        teacherPanel.style.display = 'block'
    }

    if (response.user.type == 'Student') {
        studentPanel.style.display = 'block'
        teacherPanel.style.display = 'none'
    }

}

async function addCategories() {
    // Categorias Header
    const url = 'https://plataforma-de-curso.onrender.com/categories'

    const categories = await fetch(url)

    const response = await categories.json()

    response.categories.forEach((item) => {
        let list = document.createElement('li')
        list.append(item.name)
        categoriesList.appendChild(list)
        list.addEventListener('click', async () => {
            const url = `https://plataforma-de-curso.onrender.com/categories/find/${list.innerHTML}`

            const category = await fetch(url)

            const response = await category.json()
            if (response) {
                localStorage.setItem('category', JSON.stringify(response))
                window.location.replace('../home/categories.html')
            }
        })
    })

    //Categorias selecionar

    response.categories.forEach((item) => {
        let options = document.createElement('option')
        options.append(item.name)
    })
}


explore.addEventListener('mouseover', () => {
    categoriesDiv.style.marginTop = '0'
})

explore.addEventListener('mouseout', () => {
    categoriesDiv.style.marginTop = '-150vh'
})

categoriesDiv.addEventListener('mouseover', () => {
    categoriesDiv.style.marginTop = '0'
})

categoriesDiv.addEventListener('mouseout', () => {
    categoriesDiv.style.marginTop = '-150vh'
})

logout.addEventListener('click', () => {
    localStorage.removeItem('token')
    window.location.replace('../../pages/auth/login.html')
})


async function courseInfoTeacher() {
    const url = `https://plataforma-de-curso.onrender.com/courses/teacher`

    const user = await fetch(url, {
        headers: {
            'Content-type': 'Application/json',
            'Authorization': `Bearer ${token}`
        }
    })

    const response = await user.json()

    let sectionTeacher = document.querySelector('#teacher-panel')
    let listCourse = document.createElement('div')
    response.Courses.forEach((item) => {

        // Criando elementos
        listCourse.classList.add('courses-list')
        let cardCourse = document.createElement('div')
        cardCourse.classList.add('course-card')
        let title = document.createElement('h3')
        title.innerHTML = item.name
        let buttonAddModule = document.createElement('button')
        buttonAddModule.classList.add('add-module-btn')
        buttonAddModule.innerHTML = 'Adicionar Módulo'
        let buttonAddVideo = document.createElement('button')
        buttonAddVideo.classList.add('add-video-btn')
        buttonAddVideo.innerHTML = 'Adicionar Vídeo'
        let moduleList = document.createElement('ul')
        moduleList.classList.add('modules-list')
        let list = document.createElement('li')

        // Ordena os módulos pelo índice original (posição no array)
        item.module.forEach((mod, index) => {
            const li = document.createElement('li');
            li.textContent = `${index + 1}. ${mod.name}`; // adiciona número manualmente
            moduleList.appendChild(li);
        });

        //Adicionando Elementos
        moduleList.appendChild(list)
        cardCourse.appendChild(title)
        cardCourse.appendChild(buttonAddModule)
        cardCourse.appendChild(buttonAddVideo)
        cardCourse.appendChild(moduleList)
        listCourse.appendChild(cardCourse)
        sectionTeacher.appendChild(listCourse)


        //Adicionar Modulo
        buttonAddModule.addEventListener('click', async () => {
            let cursoSelecionado = item

            let moduleModal = document.querySelector('#add-module-modal')
            moduleModal.classList.add('active')

            let cancelButton = document.querySelector('#cancel-add-module')
            let addButton = document.querySelector('#confirm-add-module')

            let nameInput = document.querySelector('#module-title')
            let descriptionInput = document.querySelector('#module-desc')

            let error = document.querySelectorAll('.error')

            cancelButton.addEventListener('click', () => {
                moduleModal.classList.remove('active')
                cursoSelecionado = null

                error.forEach((item) => {
                    item.innerHTML = ''
                })
            })


            addButton.addEventListener('click', async () => {
                const url = 'https://plataforma-de-curso.onrender.com/modules'

                const object = {
                    name: nameInput.value,
                    description: descriptionInput.value,
                    courseId: cursoSelecionado.id
                }

                const newCourse = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(object)

                })

                const response = await newCourse.json()

                if (response.error) {
                    if (response.error.name) {
                        error[0].innerHTML = response.error.name
                    } else {
                        error[0].innerHTML = ''
                    }
                    if (response.error.description) {
                        error[1].innerHTML = response.error.description
                    } else {
                        error[1].innerHTML = ''
                    }
                } else {
                    window.location.reload()
                }

            })
        })


        //Adicionar Video

        buttonAddVideo.addEventListener('click', () => {
            let cursoSelecionado = item

            let videoModal = document.querySelector('#add-video-modal')
            videoModal.classList.add('active')

            let cancelButton = document.querySelector('#cancel-add-video')
            let addButton = document.querySelector("#confirm-add-video")

            let videoName = document.querySelector('#video-name')
            let videoDescription = document.querySelector("#video-desc")
            let videoUrl = document.querySelector("#video-url")

            let selectModule = document.querySelector("#video-module")

            selectModule.innerHTML = '<option value="">Selecione o módulo</option>'

            cursoSelecionado.module.forEach((mod) => {
                let option = document.createElement('option')
                option.value = mod.id
                option.textContent = mod.name
                selectModule.appendChild(option)
            })

            let error = document.querySelectorAll('.error')
            cancelButton.addEventListener('click', () => {
                videoModal.classList.remove('active')
                cursoSelecionado = null

                videoName.value = ''
                videoDescription.value = ''
                videoUrl.value = ''

                error.forEach((item) => {
                    item.innerHTML = ''
                })
            })

            addButton.addEventListener('click', async () => {
                let url = 'https://plataforma-de-curso.onrender.com/videos'

                let object = {
                    name: videoName.value,
                    description: videoDescription.value,
                    url: videoUrl.value,
                    moduleId: parseInt(selectModule.value),
                    duration: 1
                }

                let newVideo = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'content-type': "Application/Json",
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(object)
                })

                const response = await newVideo.json()

                console.log(response)


                if (response.error) {
                    if (response.error.name) {
                        error[2].innerHTML = response.error.name
                    } else {
                        error[2].innerHTML = ''
                    }
                    if (response.error.description) {
                        error[3].innerHTML = response.error.description
                    } else {
                        error[3].innerHTML = ''
                    }
                    if (response.error.url) {
                        error[4].innerHTML = response.error.url
                    } else {
                        error[4].innerHTML = ''
                    }
                    if (response.error.moduleId) {
                        error[5].innerHTML = response.error.moduleId
                    } else {
                        error[5].innerHTML = ''
                    }
                } else {
                    window.location.reload()
                }

            })
        })

    })
}

async function courseInfoStudent() {
    const url = `https://plataforma-de-curso.onrender.com/users/me`

    const userStudent = await fetch(url, {
        headers: {
            'Content-type': 'Application/json',
            'Authorization': `Bearer ${token}`
        }
    })

    const response = await userStudent.json()


    let sectionStudent = document.querySelector('#student-panel')
    let listCourse = document.querySelector('.courses-list')

    if (response.user.enrollment.length > 0) {
        sectionStudent.querySelector('h1').style.display = 'none'
    }

    response.user.enrollment.forEach((item) => {

        //Criar  elementos
        let courseCard = document.createElement('div')
        courseCard.classList.add('course-card')
        let title = document.createElement('h3')
        title.innerHTML = item.course.name
        let status = document.createElement('p')
        status.classList.add('course-status')
        if (item.course.concluded === false) {
            status.innerHTML = `Status: <span style="color: rgb(141, 141, 15);">Em andamento</span>`
        } else {
            status.innerHTML = `Status: <span style="color: green;">Concluido</span>`
        }
        let button = document.createElement('button')
        button.innerHTML = 'Continuar Curso'

        //Adicionar Elementos
        courseCard.appendChild(title)
        courseCard.appendChild(status)
        courseCard.appendChild(button)
        listCourse.appendChild(courseCard)
        sectionStudent.appendChild(listCourse)

        //Botão ação

        button.addEventListener('click', () => {
            localStorage.setItem('idCourse', item.course.id)
            window.location.replace('../../pages/course/general.html')
        })
    })


}



courseInfoStudent()
changeName()
addCategories()
courseInfoTeacher()

