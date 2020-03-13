const express = require('express')

const server = express()

server.use(express.json())

const projects = [
    {
        id:"1",
        title:"SAMU",
        tasks : ["Integrar API"]
    }
]
var requisitions = 0
/**
 * Middleware que dá log no número de requisições
 */

server.use((req,res,next)=>{
    requisitions += 1
    console.log(`Requisitions in the server : ${requisitions}`)
    next()
})

/**
 * Middleware que checa se o projeto existe
 */

function checkIdExits(req,res,next){
    const {id} = req.params
    const projectFound = projects.find((project)=>{
        return project.id == id
    })

    if(!projectFound)
        return res.status(400).json({error:"There is not a project with id = "+id})
    return next()
}
/**
 * Retorna todos os projetos
 */

server.get('/projects',(req,res)=>{
    return res.json(projects)
})

/**
 * Request body: id, title
 * Cadastra um novo projeto
 */
server.post('/projects',(req,res)=>{
    const {id,title} = req.body
    projects.push({id:id,title:title,tasks:[]})

    return res.json(projects)
})
/**
 * Route params: id
 * Request body: title
 * Altera o título do projeto com o id presente nos parâmetros da rota.
 */
server.put('/projects/:id',checkIdExits,(req,res)=>{
    const {id} = req.params
    const {title} = req.body
    projects.forEach((project)=>{
        if(project.id == id)
            project.title = title
    })

    return res.json(projects)
})
/**
 * Route params: id
 * Deleta o projeto associado ao id presente nos parâmetros da rota.
 */
server.delete('/projects/:id',checkIdExits,(req,res)=>{
    const {id} = req.params
    const {title} = req.body
    for (const key in projects) {
        if (projects[key].id == id) {
           projects.slice(key,1) 
        }
    }
    return res.json(projects)
})

/**
 * Route params: id;
 * Adiciona uma nova tarefa no projeto escolhido via id; 
 */
server.post('/projects/:id/tasks',checkIdExits,(req,res)=>{
    const {title} = req.body
    const {id} = req.params
    projects.forEach((project)=>{
        if(project.id == id)
            project.tasks.push(title)
    })
    return res.json(projects)
})

server.listen(3000)