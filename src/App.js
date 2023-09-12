import styled from "styled-components";
import { useState, useRef, useEffect } from 'react'

const preguntas = [
    {
        text: "Hola! Soy el asistente de PELUQUERÍA, ¿en qué te puedo ayudar?",
        pregunta:true,
        type_response: 'exact_text',
        opciones: [
            {
                text: '1- Necesito un turno',
                response:'1',
                next: 2
            },
            {
                text: '2- ¿Que servicios tienen?',
                response:'2',
                next: 3
            },
            {
                text: '3- ¿En donde se encuentra la peluquería?',
                response:'3',
                next:4
            },
            {
                text: '4- ¿Cuales son sus horarios?',
                response: '4',
                next: 5
            }
        ]
    },
    {
        text: "¿Te ayudo en algo más?",
        pregunta:true,
        type_response: 'exact_text',
        opciones: [
            {
                text: '1- Necesito un turno',
                response:'1',
                next: 2
            },
            {
                text: '2- ¿Que servicios tienen?',
                response:'2',
                next: 3
            },
            {
                text: '3- ¿En donde se encuentra la peluquería?',
                response:'3',
                next:4
            },
            {
                text: '4- ¿Cuales son sus horarios?',
                response: '4',
                next: 5
            }
        ]
    },
    {
        text: '¿Qué día te queda cómodo? (response con formato dd/mm/aa )',
        pregunta:true,
        type_response: 'date',
        id:'dia_turno',
        opciones: [

        ]
    },
    {
        pregunta:false,
        text: 'Nuestros servicios son: Cortes de pelo, lavado de pelo, tintura y perfilado de cejas! Espero tu turno!',
        next: 1
    },
    {
        text: 'Nuestra peluquería esta en la calle Corrientes 1250 Villa María, te esperamos!',
        pregunta: false,
        next: 1
    },
    {
        text: 'Nuestros horarios son de Martes a Viernes de 09:00hs a 18:00hs y Sábados de 9:00hs a 13:00hs. Te esperamos!',
        pregunta: false,
        next: 1
    }
]


export default function App() {

    const [getChat, setChat] = useState([])

    const refInput = useRef()

    useEffect(() => {
        agregarPregunta(0)
    }, [])

    const agregarPregunta = pregunta => {
        if(preguntas[pregunta]) {
            setChat(i => [...i, {role:'system', ...preguntas[pregunta]}])

            if(preguntas[pregunta].opciones) {

                for(let i = 0; i < preguntas[pregunta].opciones.length; i++) {
                    const text = preguntas[pregunta].opciones[i].text;
                    sendSystemMessage(text)
                }
            }

            if(preguntas[pregunta].next != null) {
                agregarPregunta(preguntas[pregunta].next)
            }
        }
    }
    
    const enviarRespuesta = () => {
        const text = refInput.current.value;
        setChat(i => [...i, {text, role:'user'}])
        refInput.current.value = ""
        onChatResponse(text)
    }

    const onChatResponse = text => {
        let current = null;
        for(let i = getChat.length - 1; i >= 0; i--) {
            if(getChat[i].pregunta) {
                current = getChat[i];
                break;
            }
        }
        if(current != null) {
            if(current.type_response == "exact_text") {
                const response_id = current.opciones.findIndex(i => i.response == text);
                if(response_id != -1) {
                    agregarPregunta(current.opciones[response_id].next)
                } else {
                    sendSystemMessage("Disculpa, no entendí tu respuesta.")
                }
            } else if(current.type_response == "date") {

                if(current.id == "dia_turno") {
                    const split = text.split('/');
                    if(split.length == 3) {
    
                        //Funcion de buscar en esa fecha
    
                        sendSystemMessage("Disculpa, no tengo turnos disponibles para esa fecha.")
                        agregarPregunta(1)
    
                    } else {
                        sendSystemMessage("Responde con formato dd/mm/aa por favor. Ejemplo: 12/02/2023.")
                    }
                }
            }
        }
    }

    const sendSystemMessage = text => {
        setChat(i => [...i, {text, role:'system'}])
    }
    return (
        <Container>
            dsadsa
            <ChatContainer>
                <ChatHeader>
                    <span>Atención al cliente</span>
                </ChatHeader>
                <ChatMensajes>
                    {
                        getChat.map((value, index) => {

                            let direction = "center"

                            if(value.role == "system") {
                                direction = "flex-start"
                            } else if(value.role == "user") {
                                direction = "flex-end"
                            }

                            return <MensajeItem key={`3dsad-${index}`} direction={direction}>{value.text}</MensajeItem>
                        })
                    }
                </ChatMensajes>
                <ChatInput>
                    <input ref={refInput} type="text"/>
                    <button onClick={() => enviarRespuesta() }>Enviar</button>
                </ChatInput>
            </ChatContainer>
        </Container>
    );
}

const MensajeItem = ({children, direction}) => {
    return (
        <MensajeItemContent direction={direction}>
            <MensajeItemContentItem>
                {children}
            </MensajeItemContentItem>
        </MensajeItemContent>
    )
}

const MensajeItemContent = styled.div`
display:flex;
flex-direction:row;
justify-content: ${props => props.direction};
width:100%;
`

const MensajeItemContentItem = styled.div`
padding:6px 12px;
background:#f5f5f5;
display:block;
border-radius:14px;
${props => props.opcion ? `user-select:none;cursor:pointer;font-weight:bold;` : ``}
transition:background 0.4s;

&:hover {
    ${props => props.opcion ? `background:#e3e3e3;` : ``}   
}
`

const ChatHeader = styled.div`
padding:10px;
border-bottom:1px solid #e1e1e1;
& > span {
    font-size:18px;
}
`

const ChatMensajes = styled.div`
min-height:360px;
max-height:360px;
display:flex;
flex-direction:column;
align-items:flex-start;
padding:4px;
overflow-y:auto;
gap:10px;
`

const ChatInput = styled.div`
display:flex;
padding:5px;

& > input {
    background:#f5f5f5;
    border:1px solid #e1e1e1;
    width:100%;
    outline:0;
    padding:2px;
    box-sizing:border-box;
    font-size:16px;
}
`

const ChatContainer = styled.div`
border-radius:10px 10px 0 0;
position:fixed;
width:300px;
box-sizing:border-box;
bottom:0;
right:10%;
background:#fff;
border:1px solid #e1e1e1;
`

const Container = styled.div`
width:100%;
min-height:100vh;
`