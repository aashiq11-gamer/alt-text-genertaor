import express from "express";
import multer from "multer";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import fs from "fs";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.static("public"));

const upload = multer({ dest: "uploads/" });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/generate-alt", upload.single("image"), async (req, res) => {
  try {
    const imagePath = req.file.path;
    const base64Image = fs.readFileSync(imagePath, { encoding: "base64" });

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Generate a short SEO friendly alt text (max 125 characters)." },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 100
    });

    const altText = response.choices[0].message.content;

    fs.unlinkSync(imagePath);

    res.json({ alt: altText });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error generating alt text" });
  }
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
