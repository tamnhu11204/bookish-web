import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ReviewFeedbackChatbot.css";

const API_BASE_URL = process.env.REACT_APP_CHATBOT_API_URL || "http://localhost:8000";

const ReviewFeedbackChatbot = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [intents, setIntents] = useState([]);
    const [search, setSearch] = useState("");
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setError(null);
                const intentsRes = await axios.get(`${API_BASE_URL}/intents`);
                setIntents(intentsRes.data.intents || []);
                const feedbacksRes = await axios.get(`${API_BASE_URL}/feedbacks`);
                setFeedbacks(feedbacksRes.data.feedbacks || []);
            } catch (error) {
                console.error("Error loading data:", error);
                setError(`Lỗi khi tải dữ liệu: ${error.response?.statusText || error.message}`);
            }
        };
        loadData();
    }, []);

    const filterFeedback = () => {
        return feedbacks.filter((item) =>
            item.user_input.toLowerCase().includes(search.toLowerCase())
        );
    };

    const submitCorrection = async (userInput, selectId) => {
        const intent = document.getElementById(selectId).value;
        try {
            setError(null);
            const res = await axios.post(`${API_BASE_URL}/correct_feedback`, {
                user_input: userInput,
                correct_intent: intent,
            });
            if (res.data.status === "success") {
                alert("✅ Đã lưu phản hồi.");
                const feedbacksRes = await axios.get(`${API_BASE_URL}/feedbacks`);
                setFeedbacks(feedbacksRes.data.feedbacks || []);
            } else {
                alert("❌ Có lỗi khi lưu.");
            }
        } catch (error) {
            console.error("Error submitting correction:", error);
            setError(`Lỗi khi lưu phản hồi: ${error.response?.statusText || error.message}`);
        }
    };

    const retrainModel = async (e) => {
        e.preventDefault();
        if (!window.confirm("Bạn có chắc muốn huấn luyện lại mô hình?")) return;
        try {
            setError(null);
            const res = await axios.post(`${API_BASE_URL}/retrain`, {}, {
                headers: { "Content-Type": "application/json" }
            });
            alert(res.data.message || "✅ Đã huấn luyện lại mô hình.");
        } catch (error) {
            console.error("Error retraining model:", error);
            console.log("Error details:", error.response?.data);
            setError(`Lỗi khi huấn luyện lại: ${error.response?.statusText || error.message}`);
        }
    };

    return (
        <div className="review-feedback">
            {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}
            <h2>🧠 Review Phản Hồi Sai</h2>
            <input
                type="text"
                id="search"
                placeholder="Tìm kiếm user input..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <table id="feedback-table">
                <thead>
                    <tr>
                        <th>User Input</th>
                        <th>Intent Sai</th>
                        <th>Response Sai</th>
                        <th>Intent Đúng</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {filterFeedback().map((item, index) => (
                        <tr key={index}>
                            <td>{item.user_input}</td>
                            <td>{item.intent}</td>
                            <td>{item.response_sai}</td>
                            <td>
                                <select id={`intent_${index}`}>
                                    {intents.map((intent) => (
                                        <option key={intent.tag} value={intent.tag}>
                                            {intent.tag}
                                        </option>
                                    ))}
                                </select>
                            </td>
                            <td>
                                <button onClick={() => submitCorrection(item.user_input, `intent_${index}`)}>
                                    Lưu
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <form onSubmit={retrainModel}>
                <button type="submit">🔁 Huấn luyện lại mô hình</button>
            </form>
        </div>
    );
};

export default ReviewFeedbackChatbot;