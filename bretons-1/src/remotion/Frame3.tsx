export const Frame3: React.FC<{ text: string }> = ({ text }) => {
    return (
      <div>
          <h1 style={{ position: "absolute", color: "while"}}>{text}</h1>
          <img style={{height: "100%"}} src="/bretons-1/img/video_cover/tennis.jpg" alt='background' />;
      </div>
    );
};