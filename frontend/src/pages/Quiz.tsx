import {
    Box,
    CircularProgress,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
    FormLabel,
    Button
  } from "@mui/material";
  import { useEffect, useState } from "preact/hooks";
  import { useLocation, useNavigate } from "react-router-dom";
  
  type AnswerSet = [string, string, string, string];
  
  interface ResponseFormat {
    questions: string[];
    answers: AnswerSet[];
  }
  interface User{
      user_id:number,
      firstname:string,
      lastname:string,
      username: string,
      email: string,
      password: string,
      confirmPassword: string,
      role: string
  }
  
  export default function Quiz() {
    const location = useLocation();
    const navigate = useNavigate();
    const post_id = location.state?.post.id;
    const company_name = location.state?.post.company_name;
  
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [score, SetScore] = useState(0);
    const [questions, setQuestions] = useState<string[]>([]);
    const [answers, setAnswers] = useState<AnswerSet[]>([]);
    const [correctAnswers, setCorrectAnswers] = useState<string[]>([]);
    const [selectedAnswers, setSelectedAnswers] = useState<string[]>(new Array(5).fill(""));
  
    function formatID(id: number): string {
      return id.toString().padStart(3, "0");
    }
    function countPoints(arr1: string[], arr2: string[]): number {
        const minLength = Math.min(arr1.length, arr2.length);
        let matches = 0;
      
        for (let i = 0; i < minLength; i++) {
          if (arr1[i] === arr2[i]) {
            matches++;
          }
        }
      
        return matches;
      }
  
    async function generateQuestions(): Promise<ResponseFormat | undefined> {
      setError("");
      const id = formatID(post_id);
      if (!id) return;
  
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/generate-questions?pdfId=${encodeURIComponent(id)}`
        );
  
        if (response.status === 200) {
          const result: ResponseFormat = await response.json();

          setLoading(false);
          return result;
        } else {
          const errorData = await response.json();
          setError(errorData.message || "Failed to load questions.");
        }
      } catch (error) {
        setError("An error occurred. Please retry.");
      }
    }

    async function getUserByUsername(username:string | null):Promise<User | undefined>{
      try{
        const response = await fetch(`http://localhost:8081/user/username/${username}`)

        if(response.status === 200){
          return response.json();
        } 
        return undefined;
      } catch (error) {
      setError("An error occurred. Please retry.");
    }
    }
    async function postApplication(){
      const username = localStorage.getItem("username");
      const user = await getUserByUsername(username);
      console.log(company_name);
      if(user?.user_id === undefined){
        return;
      }
      const formData = {
        post_id: post_id,
        applier_id: user.user_id,
        companyName: company_name,
        score: score
      }
      setError('')
        try {
            const response = await fetch("http://localhost:8081/application/addApplication", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
              });

            if(response.status === 201) {
                alert("Application submitted!");
            } else {
                const errorText = await response.text();
                setError(errorText)
            }
        } catch(err) {
            setError('An error occured during sumbitting')
        }
    }
    useEffect(() => {
        async function fetchQuestions() {
          const result:ResponseFormat|undefined = await generateQuestions();
          if (result !== undefined && result.questions.length === result.answers.length) {

            setQuestions(result.questions);
            setAnswers(result.answers);
            setCorrectAnswers(result.answers.map((ans) => ans[0]));
            setSelectedAnswers(new Array(result.questions.length).fill(""));
          } else {
            console.error("Mismatch in questions and answers length", result);
          }
        }
      
        fetchQuestions();
      }, [post_id]);
  
    const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement>, questionIndex: number) => {
      const newSelectedAnswers = [...selectedAnswers];
      newSelectedAnswers[questionIndex] = event.currentTarget.value;
      setSelectedAnswers(newSelectedAnswers);
    };
  
    const handleSubmit = () => {
      if (correctAnswers.length === 0) return;
  
      const points = countPoints(selectedAnswers,correctAnswers);
      SetScore(points),
      console.log(points);
      postApplication();
      navigate("/");
    };
  
    return (
      <div style={{ height: "100vh", overflowY: "auto", backgroundColor: "#f5f5f5" }}>
        {isLoading ? (
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 4 }}>
            <CircularProgress />
            <span style={{ marginLeft: "10px" }}>Generating Questions...</span>
          </Box>
        ) : (
          <div style={{ backgroundColor: "white", padding: 24, maxWidth: 800, margin: "auto" }}>
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            {
                questions.map((question, index) => (
    <div key={index} style={{ marginBottom: "20px" }}>
      <FormControl component="fieldset" sx={{ display: "flex" }}>
        <FormLabel component="legend" sx={{ fontWeight: "bold" }}>
          {question}
        </FormLabel>
        <RadioGroup
          name={`question-${index}`}
          value={selectedAnswers[index] || ""}
          onChange={(e) => handleAnswerChange(e, index)}
          sx={{ paddingLeft: "20px" }}
        >
          {answers[index]?.map((answer, i) => (
            <FormControlLabel
              key={i}
              value={answer}
              control={<Radio />}
              label={answer}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </div>
))}
              <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
                <Button type="submit" variant="contained">Submit</Button>
              </Box>
            </form>
          </div>
        )}
      </div>
    );
  }
  