carregar_dados()

async function carregar_dados() {
    await fetch("/dados")
    .then(r => r.json())
    .then(resposta => {
        const userId = resposta.id_usuario
        var humano = [0, 0]
        var chatgpt = [0, 0]
        var gemini = [0, 0]
        var deepseek = [0, 0]
        var mediaPessoas = [{}]

        // Pegando acertos e erros do humano, chatgpt, gemini e deepseek
        resposta.dados.forEach(obj => {
            if(obj.acertou == 's')
            {
                if(obj.ia_utilizada == "chatgpt") chatgpt[1]++
                if(obj.ia_utilizada == "gemini") gemini[1]++
                else deepseek[1]++
                
                if(obj.id_pessoa == userId) humano[0]++
                else
                {
                    let achou = false
                    mediaPessoas.forEach(el => {
                        if(el.id == obj.id_pessoa) 
                        {
                            el.acertos++
                            achou = true
                        }
                    })

                    if(!achou)
                        mediaPessoas.push({"id": obj.id_pessoa, "acertos": 0, "erros": 0})
                }
            }
            else
            {
                if(obj.ia_utilizada == "chatgpt") chatgpt[0]++
                if(obj.ia_utilizada == "gemini") gemini[0]++
                else deepseek[0]++

                if(obj.id_pessoa == userId)  humano[1]++
                else
                {
                    let achou = false
                    mediaPessoas.forEach(el => {
                        if(el.id == obj.id_pessoa) 
                        {
                            el.erros++
                            achou = true
                        }
                    })

                    if(!achou)
                        mediaPessoas.push({"id": obj.id_pessoa, "acertos": 0, "erros": 0})
                }
            }   
        });

        let percentHumano = (humano[0]/(humano[0] + humano[1]))
        let percentChatgpt = chatgpt[0]/(chatgpt[0] + chatgpt[1])
        let percentGemini = gemini[0]/(gemini[0] + gemini[1])
        let percentDeepseek = deepseek[0]/(deepseek[0] + deepseek[1])
        var mediaIas = (percentGemini + percentChatgpt + percentDeepseek) / 3
       
        const ctx = document.getElementById('graph').getContext('2d');

        const dados = {
            labels: ['IAs', 'Chatgpt', 'Gemini', 'DeepSeek'],
            datasets: [{
                label: 'Variação (%)',
                data: [
                    parseInt((percentHumano - mediaIas) * 100),
                    parseInt((percentHumano - percentChatgpt) * 100),
                    parseInt((percentHumano - percentGemini) * 100),
                    parseInt((percentHumano - percentDeepseek) * 100)
                ],
                backgroundColor: function(ctx) {
                    const valor = ctx.dataset.data[ctx.dataIndex];
                    return valor >= 0 ? '#22c55e' : '#EF4444'; // verde / vermelho
                },
                borderRadius: 4,
            }]
        };

        const opcoes = {
            responsive: true,
            maintainAspectRatio: false,
            devicePixelRatio: 2,
            layout: {
                padding: {
                    top: 30,     // espaço extra em cima (evita cortar verde)
                    bottom: 30   // espaço extra embaixo (afasta do eixo X)
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: context => `${context.parsed.y}%`
                    }
                },
                datalabels: {
                    anchor: function(context) {
                        const valor = context.dataset.data[context.dataIndex];
                        return valor >= 0 ? 'end' : 'start';
                    },
                    align: function(context) {
                        const valor = context.dataset.data[context.dataIndex];
                        return valor >= 0 ? 'end' : 'start';
                    },
                    offset: 6,
                    formatter: value => `${value}%`,
                    color: 'black',
                    font: {
                        weight: 'bold',
                        size: 14
                    },
                    clip: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        drawTicks: false,
                        drawBorder: false,
                        color: function(context) {
                            // só desenha a linha no zero
                            return context.tick.value === 0 ? '#00000025' : 'transparent';
                        },
                        lineWidth: function(context) {
                            return context.tick.value === 0 ? 2 : 0;
                        }
                    },
                    border: { display: false },
                    ticks: { display: false }
                },
                x: {
                    grid: { display: false },
                    border: { display: false },
                    ticks: {
                        align: 'center',
                        padding: 15  // mais espaço entre labels e valores vermelhos
                    }
                }
            }
        };

        const grafico = new Chart(ctx, {
            type: 'bar',
            data: dados,
            options: opcoes,
            plugins: [ChartDataLabels]
        });

        // aumenta um pouco a altura
        document.getElementById('graph').style.height = "320px";


        let sum = 0.0
        mediaPessoas.forEach(el => {
            let  total = el.acertos + el.erros
            
            if(total > 0)
                sum = sum + el.acertos / (el.acertos + el.erros)
        })

        var p
        percentHumano = parseInt(percentHumano * 100)

        // Barra de progresso circular
        if(percentHumano > 0)
        {
            document.getElementById("percentCircle").innerHTML += `Você acertou ${percentHumano}% das perguntas`
            p = Math.max(0, Math.min(100, percentHumano)); // limita entre 0 e 100
            document.querySelector('.text').textContent = p + "%";
            document.querySelector(".text").style.fill = '#22c55e'
            document.querySelector(".cprogress").style.stroke = '#22c55e'
        }
        else
        {
            document.getElementById("percentCircle").innerHTML += 'Você não acertou nenhuma pergunta'
            document.querySelector('.text').textContent = '0%';
            document.querySelector(".text").style.fill = '#000'
        }

        document.querySelector('.cprogress').style.strokeDashoffset = 100 - p;
    });
}
