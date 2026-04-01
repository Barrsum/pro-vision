const API_URL = import.meta.env.VITE_API_URL; // replace with your backend server url, example: const API_URL = "https://localhost:3000";   or put the full url in the .env file as VITE_API_URL=http://localhost:3000

export const analyzeImage = async (base64Image) => {
  try {
    // Strip header if present
    const base64Clean = base64Image.includes(',') 
      ? base64Image.split(',')[1] 
      : base64Image;

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "meta/llama-3.2-11b-vision-instruct", 
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: "Analyze this image. Describe the subject, lighting, and mood. Format in Markdown with bold headers." },
              { type: "image_url", image_url: { url: `data:image/jpeg;base64,${base64Clean}` } }
            ]
          }
        ]
      })
    });

    const quota = response.headers.get("X-RateLimit-Remaining");

    if (!response.ok) {
      if (response.status === 429) throw new Error("Daily Limit Reached. Come back tomorrow!");
      throw new Error("Analysis Failed. Try again.");
    }

    const data = await response.json();
    return { 
      text: data.choices[0].message.content, 
      quota: quota 
    };

  } catch (error) {
    throw error;
  }
};

// Created by Ram Bapat, www.linkedin.com/in/ram-bapat-barrsum-diamos