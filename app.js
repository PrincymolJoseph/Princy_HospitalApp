const express = require('express');
const app = new express();
const fs = require("fs");

const filename = 'hospitalData.json'

app.use(express.json());//to recognize json payloads

app.get('/getData', (req, res) => {
    fs.readFile(filename, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }
        res.send(data);
    });
});

app.post('/postData', (req, res) => {
    fs.readFile(filename, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }
        const records = JSON.parse(data);
        const newRecord = req.body;
        console.log(newRecord)
        records.push(newRecord);
        fs.writeFile(filename, JSON.stringify(records, null, 4), err => {
            if (err) {
                console.error('Error writing file:', err);
                return;
            }
            res.status(201).send('Record created successfully');
        });
    });
});

app.put('/putData/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const updatedRecord = req.body;
    fs.readFile(filename, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }
        const records = JSON.parse(data);
        const index = records.findIndex(record => record.id === id);
        if (index !== -1) {
            records[index] = { ...records[index], ...updatedRecord };
            fs.writeFile(filename, JSON.stringify(records, null, 4), err => {
                if (err) {
                    console.error('Error writing file:', err);
                    return;
                }
                res.send('Record updated successfully');
            });
        } else {
            res.status(404).send('Record not found');
        }
    });
});

app.delete('/deleteData/:id', (req, res) => {
    const id = parseInt(req.params.id);
    fs.readFile(filename, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }
        let records = JSON.parse(data);
        const index = records.findIndex(record => record.id === id);
        if (index !== -1) {
            records.splice(index, 1);
            fs.writeFile(filename, JSON.stringify(records, null, 4), err => {
                if (err) {
                    console.error('Error writing file:', err);
                    return;
                }
                res.send('Record deleted successfully');
            });
        } else {
            res.status(404).send('Record not found');
        }
    });
});

app.listen(3000,()=>{
    // console.log(data);
})



