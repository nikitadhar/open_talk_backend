// import client from "../config/open-route-configuration.js";
import User from "../models/user-model.js"
export const generateChat = async (
  req, res, next) => {
  try {
    // First API call
    const { message } = req.body;
    const client = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: process.env.OPENROUTER_API_KEY,
    });
    const user = await User.findById(res.locals.jwtData.id);
    if (!user)
      return res
        .status(401)
        .json({ message: "User not registered OR Token malfunctioned" });
    // grab chats of user
    const chats = user.chats.map(({ role, content }) => ({
      role,
      content,
    }))
    chats.push({ content: message, role: "user" });
    user.chats.push({ content: message, role: "user" });
    const response1 = await client.chat.completions.create({
      model: "openrouter/free",
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
      extra_body: {
        reasoning: { enabled: true }, // JS uses true, not True
      },
    });

    const assistantMessage = response1.choices[0].message;
    user.chats.push(assistantMessage);
    await user.save();
    res.json({
      chats: user.chats
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
}

// Send all chat to user
export const sendChatsToUser = async (
  req,
  res,
  next
) => {
  try {
    //user token check
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).send("User not registered OR Token malfunctioned");
    }
    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send("Permissions didn't match");
    }
    const sortedChats = [...user.chats].sort((a, b) => {
      return (
        new Date(a.createdAt || 0).getTime() -
        new Date(b.createdAt || 0).getTime()
      );
    });
    return res.status(200).json({ message: "OK", chats: sortedChats });
  } catch (error) {
    console.log(error);
    return res.status(200).json({ message: "ERROR", cause: error.message });
  }
};

// DELETE ALL CHAT A USER
export const deleteChats = async (
  req,
  res,
  next
) => {
  try {
    //user token check
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).send("User not registered OR Token malfunctioned");
    }
    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send("Permissions didn't match");
    }
    //@ts-ignore
    user.chats = [];
    await user.save();
    return res.status(200).json({ message: "OK" });
  } catch (error) {
    console.log(error);
    return res.status(200).json({ message: "ERROR", cause: error.message });
  }
};
