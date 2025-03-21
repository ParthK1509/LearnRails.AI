var express = require('express');
var router = express.Router();

/* POST to LLM*/
router.post('/', async function(req, res, next) {
    try {
        const topic = req.body.topic;
        const response = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    Authorization:
                    "Bearer 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",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: "deepseek/deepseek-r1-zero:free",
                    messages: [
                        {
                            role: "user",
                            content: `Create a structured learning roadmap for ${topic}. Give main subtopics-topics in a list and some short description for them`,
                        },
                    ],
                }),
            }
        );
        const data = await response.json();
        console.log(data)
        res.json(data.choices[0]?.message?.content)
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve information' });
    }
});

module.exports = router;
