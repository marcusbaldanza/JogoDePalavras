
    let hiddenWord; // Palavra oculta escolhida pelo jogador
    let score;
    let attempts;
    let playerName;
	let challengerName;
	let hint; // Variável para armazenar a dica
    let hintUsed = false; // Indica se a dica já foi usada no jogo atual
    let previousWords = {}; // Armazena palavras já digitadas
    let ranking = []; // Armazena o ranking dos jogadores

    function startGame() {
        // Se o ranking já tiver o jogador, não pede o nome novamente
        
		hint = prompt("Digite uma dica para a palavra (até 80 caracteres):");
        if (!hint || hint.length > 80) {
            alert("Dica inválida. Tente novamente (máximo de 80 caracteres).");
            return;
        }
		
		if (!challengerName) {
            challengerName = prompt("Digite o nome do Desafiante:");
            if (!challengerName) {
                alert("Nome de desafiante inválido. Tente novamente.");
                return;
            }
        }
		
		if (!playerName) {
            playerName = prompt("Digite o nome do desafiado:");
            if (!playerName) {
                alert("Nome inválido. Tente novamente.");
                return;
            }
        }
		
		
        const wordInput = document.getElementById('hiddenWordInput').value.toLowerCase();
        if (wordInput.length >= 4 && wordInput.length <= 10) {
            hiddenWord = wordInput;
            resetGame();
            document.getElementById('startMenu').style.display = "none"; // Oculta o menu de início
            document.getElementById('gameWrapper').style.display = "flex"; // Exibe a área do jogo
        } else {
            alert("A palavra deve ter entre 4 e 10 letras.");
        }
		
		hintUsed = false; // Reinicia o uso da dica
        document.getElementById('hintButton').disabled = false; // Habilita o botão de dica
        document.getElementById('hintMessage').innerText = ''; // Limpa a mensagem da dica
    }

    function calculateSimilarity(word1, word2) {
        let points = 0;
        const len = Math.min(word1.length, word2.length);
        for (let i = 0; i < len; i++) {
            if (word1[i] === word2[i]) {
                points += 0.05; // Ganha 0,05 por letra na posição correta
            } else {
                points -= 0.1; // Reduz 0,1 por letra na posição errada
            }
        }
        return points;
    }

    function highlightCorrectLetters(userWord) {
        let highlightedWord = '';
        for (let i = 0; i < userWord.length; i++) {
          let letterClass = userWord[i] === hiddenWord[i] ? 'correct-letter' : 'incorrect-letter'; // Define a classe correta ou incorreta
          highlightedWord += `<span class="word-box ${letterClass}">${userWord[i]}</span>`;
        }
        return highlightedWord;
    }

    
    function updateAttemptsList(word, similarityPoints) {
        const attemptsList = document.getElementById('attemptsList');
        const highlightedWord = highlightCorrectLetters(word);
        attemptsList.innerHTML += `<li>${highlightedWord}Similaridade: ${similarityPoints.toFixed(2)}</li>`;
    }

	function showHint() {
		if (!hintUsed) {
			document.getElementById('hintMessage').innerText = `Dica: ${hint}`; // Mostra "Dica: " antes da dica
			score -= 10;
			document.getElementById('scoreMessage').innerText = `Pontuação atual: ${score.toFixed(2)} pontos.`;
			hintUsed = true;
			document.getElementById('hintButton').disabled = true;
			const hintButton = document.getElementById('hintButton');
			hintButton.disabled = true;
			hintButton.classList.add('hint-used');
		}
	}

  function updateRanking() {
        const rankingList = document.getElementById('rankingList');
        const rankingItem = {
            challenger: challengerName,
			name: playerName,
            score: score,
            attempts: attempts,
            result: hiddenWord
        };

        ranking.push(rankingItem);

        // Ordena o ranking em ordem decrescente de pontuação
        ranking.sort((a, b) => b.score - a.score);

        // Limpa a lista atual e adiciona o ranking atualizado
        rankingList.innerHTML = '';
        ranking.forEach(item => {
            rankingList.innerHTML += `<li>${item.name} - Desafiado(a) por: ${item.challenger} - Pontuação: ${item.score.toFixed(2)} - Tentativas: ${item.attempts} - Acertou: ${item.result}</li>`;
        });
    }

    function checkWord() {
        const userWord = document.getElementById('userInput').value.toLowerCase();
        if (previousWords.hasOwnProperty(userWord)) {
            alert("Você já tentou essa palavra!");
            return;
        }

	
        attempts++;
        if (userWord === hiddenWord) {
            document.getElementById('resultMessage').innerText = "Parabéns, você acertou a palavra!";
            document.getElementById('newGameButton').style.display = "block"; // Exibe o botão de novo jogo
            updateRanking();
        } else {
            let similarityPoints = calculateSimilarity(userWord, hiddenWord);
            score += similarityPoints; // Atualiza a pontuação
            score -= 0.25; // Reduz 0,25 pela tentativa errada
            previousWords[userWord] = similarityPoints; // Salva a tentativa
            updateAttemptsList(userWord, similarityPoints); // Atualiza a lista de tentativas

            document.getElementById('resultMessage').innerText = "Tente novamente!";
            document.getElementById('scoreMessage').innerText = `Pontuação atual: ${score.toFixed(2)} pontos.`;
        }

        document.getElementById('userInput').value = ""; // Limpa o campo de entrada
    }

    function startNewGame() {
        // Reseta o jogo, mas mantém o ranking e pede o nome do jogador novamente
			challengerName = prompt("Digite o nome do desafiante:");
		let newWord = prompt("Digite a nova palavra oculta (de 4 a 10 letras):");
		hint = prompt("Digite uma dica para a palavra (até 80 caracteres):");
        
        if (newWord && newWord.length >= 4 && newWord.length <= 10) {
            hiddenWord = newWord.toLowerCase();
			if (!hint || hint.length > 80) {
            alert("Dica inválida. Tente novamente (máximo de 80 caracteres).");
            return;
			}
			playerName = prompt("Digite o nome do desafiado:");	
            resetGame();
        } else {
            alert("A palavra deve ter entre 4 e 10 letras.");
        }
		hintUsed = false; // Reinicia o uso da dica
        document.getElementById('hintButton').disabled = false; // Habilita o botão de dica
        document.getElementById('hintMessage').innerText = ''; // Limpa a mensagem da dica
    }

    function resetGame() {
        score = 100;
        attempts = 0;
        previousWords = {}; // Limpa as palavras tentadas
        document.getElementById('attemptsList').innerHTML = ''; // Limpa lista de tentativas
        document.getElementById('resultMessage').innerText = '';
        document.getElementById('scoreMessage').innerText = '';
        document.getElementById('newGameButton').style.display = "none"; // Esconde o botão de novo jogo
        document.getElementById('userInput').value = ""; // Limpa o campo de entrada
		const hintButton = document.getElementById('hintButton');
		hintButton.disabled = false;
		hintButton.classList.remove('hint-used');
    }
	
	function exportRankingToHTML() {
        // Cria uma tabela HTML
        //let tableHTML = '<table class="exported-table">';
    
		const tableCSS = `
            <style>
                .exported-table {
                    width: 90%;
                    max-width: 800px;
                    border-collapse: collapse;
                    margin: 20px auto;
                    font-family: 'Arial', sans-serif;
                    font-size: 18px; 
                    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1); 
                    border: 2px solid transparent;
                    background-image: linear-gradient(#fff, #fff), linear-gradient(to right, #0277bd, #4caf50);
                    background-origin: border-box;
                    background-clip: content-box, border-box;
                }

                .exported-table th, .exported-table td {
                    border: 1px solid #ddd;
                    padding: 15px; 
                    text-align: left;
                }

                .exported-table th {
                    background-color: #0277bd; 
                    color: white;
                }

                .exported-table tr:nth-child(even) {
                    background-color: #f2f2f2;
                }

                .table-footer {
                    text-align: center;
                    margin-top: 10px;
                    font-size: 14px;
                    color: #455a64; 
                }
            </style>
        `;
		let tableHTML = '<table class="exported-table">';
		const today = new Date();
        const formattedDate = today.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
		tableHTML += tableCSS; // Adiciona o CSS no início do HTML        
		tableHTML += '<thead><tr><th>Posição</th><th>Jogador</th><th>Desafiante</th><th>Pontuação</th><th>Tentativas</th><th>Palavra</th></tr></thead><tbody>';
		
		// Adiciona os dados do ranking à tabela
        ranking.forEach((item, index) => {
            tableHTML += `<tr>
                <td>${index + 1}</td>
                <td>${item.name}</td>
				<td>${item.challenger}</td>
                <td>${item.score.toFixed(2)}</td>
                <td>${item.attempts}</td>
                <td>${item.result}</td>
            </tr>`;
        });

        tableHTML += `<div class="table-footer">Data de jogo: ${formattedDate}</div>`;

        // Cria um Blob com o HTML da tabela
        const blob = new Blob([tableHTML], { type: 'text/html' });
        const url = window.URL.createObjectURL(blob);

        // Cria um link para download e clica automaticamente
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ranking.html';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }
	
	document.getElementById('exportButton').addEventListener('click', exportRankingToHTML);
