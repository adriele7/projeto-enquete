const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const PORT = 3000;

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'Leoadrieledu3564@', 
    database: 'enquete_db'
};

app.use(cors()); 
app.use(express.json()); 

app.use(express.static('public'));

app.get('/api/votos', async (req, res) => {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT opcao_nome, total_votos FROM tbl_votos ORDER BY total_votos DESC');
        res.json(rows); 
    } catch (err) {
        console.error('Erro ao buscar votos:', err);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    } finally {
        if (connection) connection.end();
    }
});

app.post('/api/votar', async (req, res) => {
    const { opcao } = req.body;
    let connection;

    if (!opcao) {
        return res.status(400).json({ error: 'Opção de voto é obrigatória.' });
    }

    try {
        connection = await mysql.createConnection(dbConfig);
        
        const [result] = await connection.execute(
            'UPDATE tbl_votos SET total_votos = total_votos + 1 WHERE opcao_nome = ?',
            [opcao]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Opção de voto inválida.' });
        }

        res.json({ message: 'Voto registrado com sucesso!' });
    } catch (err) {
        console.error('Erro ao registrar voto:', err);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    } finally {
        if (connection) connection.end();
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});