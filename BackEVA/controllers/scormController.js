import fs from 'fs';
import path from 'path';
import archiver from 'archiver';
import { fileURLToPath } from 'url';
import Video from '../models/videoModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const exportScorm = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Video ID:', id);

        const video = await Video.findById(id).populate('preguntas');
        if (!video) {
            console.log('Video not found');
            return res.status(404).json({ success: false, message: 'Video not found' });
        }

        const questions = video.preguntas.map(question => ({
            questionText: question.questionText,
            pista: question.pista,
            intentosPermitidos: question.intentosPermitidos,
            options: question.options,
            time: question.time
        }));

        const questionJsonContent = JSON.stringify(questions, null, 2);

        const buildDir = path.join(__dirname, '..', 'build');
        console.log('Build Directory:', buildDir);
        if (!fs.existsSync(buildDir)) {
            fs.mkdirSync(buildDir);
        }

        const questionJsonPath = path.join(buildDir, 'question.json');
        console.log('Question JSON Path:', questionJsonPath);
        fs.writeFileSync(questionJsonPath, questionJsonContent);

        const videoSourcePath = path.join(__dirname, '..', video.videoPath);
        console.log('Video Source Path:', videoSourcePath);
        const videoDestPath = path.join(buildDir, 'video.mp4');
        console.log('Video Destination Path:', videoDestPath);
        fs.copyFileSync(videoSourcePath, videoDestPath);

        // Crear el archivo .zip
        const zipFilePath = path.join(__dirname, '..', 'scorm_export.zip');
        console.log('Zip File Path:', zipFilePath);
        const output = fs.createWriteStream(zipFilePath);
        const archive = archiver('zip', {
            zlib: { level: 9 }
        });

        // Añadir eventos de registro para diagnóstico
        archive.on('entry', entry => {
            console.log('Añadiendo archivo al .zip:', entry.name);
        });

        archive.on('warning', err => {
            if (err.code === 'ENOENT') {
                console.warn('Warning:', err);
            } else {
                throw err;
            }
        });

        archive.on('error', err => {
            console.error('Error al crear el archivo .zip:', err);
            throw err;
        });

        output.on('close', () => {
            console.log(`Archivo .zip creado con ${archive.pointer()} bytes`);
            console.log('Contenido de la carpeta comprimida:', fs.readdirSync(buildDir));
            res.set({
                'Content-Type': 'application/zip',
                'Content-Disposition': 'attachment; filename="scorm_export.zip"',
                'Content-Length': fs.statSync(zipFilePath).size
            });
            const readStream = fs.createReadStream(zipFilePath);
            readStream.pipe(res).on('finish', () => {
                console.log('Archivo .zip enviado y descargado');
                // Eliminar el archivo .zip después de la descarga
                fs.unlinkSync(zipFilePath);
            }).on('error', err => {
                console.error('Error al enviar el archivo .zip:', err);
                res.status(500).json({ success: false, message: 'Error sending zip file' });
            });
        });

        archive.pipe(output);
        archive.directory(buildDir, false);
        console.log('Finalizando el archivo .zip...');
        await archive.finalize();
        console.log('Archivo .zip finalizado.');
    } catch (error) {
        console.error('Error al exportar SCORM:', error);
        res.status(500).json({ success: false, message: 'Error exporting SCORM' });
    }
};
