/**
 * Brainwise API Documentation
 * 
 * This file documents all API endpoints available in the Brainwise platform.
 * Each endpoint includes information about its purpose, required parameters,
 * authentication requirements, and response format.
 */

export const apiDocumentation = {
  basePath: "/api",
  baseUrl: "https://brainwise-sigma.vercel.app/api",
  
  endpoints: [
    {
      path: "/stroke/predict",
      method: "POST",
      description: "Predicts stroke risk based on provided health factors",
      authentication: "Required - Clerk user authentication",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["gender", "age", "hypertension", "heartDisease", "avgGlucoseLevel", "bmi"],
              properties: {
                gender: { type: "string", enum: ["male", "female", "other"], description: "User's gender" },
                age: { type: "number", description: "User's age in years" },
                hypertension: { type: "boolean", description: "Whether the user has hypertension" },
                heartDisease: { type: "boolean", description: "Whether the user has heart disease" },
                avgGlucoseLevel: { type: "number", description: "Average glucose level in blood (mg/dL)" },
                bmi: { type: "number", description: "Body Mass Index" },
                smokingStatus: { type: "string", enum: ["never", "formerly", "smokes"], description: "User's smoking status" },
                everMarried: { type: "boolean", description: "Whether the user has ever been married" },
                workType: { type: "string", description: "Type of work/occupation" },
                residenceType: { type: "string", enum: ["urban", "rural"], description: "Type of residence area" }
              }
            }
          }
        }
      },
      responses: {
        "200": {
          description: "Successful prediction",
          content: {
            "application/json": {
              example: {
                prediction: "Moderate Risk",
                probability: 0.30,
                riskFactors: ["Age > 65", "Hypertension"],
                modelStatus: "under_construction"
              }
            }
          }
        },
        "400": { description: "Missing required fields or invalid input" },
        "401": { description: "Unauthorized - User not authenticated" },
        "500": { description: "Server error during prediction processing" }
      }
    },
    
    {
      path: "/alzheimers/predict",
      method: "POST",
      description: "Predicts Alzheimer's risk based on provided health and cognitive factors",
      authentication: "Required - Clerk user authentication",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["age", "sex", "education", "memoryComplaints", "familyHistory", 
                        "cognitiveAssessment", "mobility", "independentLiving"],
              properties: {
                age: { type: "number", description: "User's age in years" },
                sex: { type: "string", enum: ["male", "female"], description: "User's biological sex" },
                education: { type: "string", description: "User's education level" },
                memoryComplaints: { type: "boolean", description: "Whether the user has subjective memory complaints" },
                familyHistory: { type: "boolean", description: "Family history of dementia or Alzheimer's" },
                cognitiveAssessment: { type: "number", description: "Score from cognitive assessment (e.g., MMSE)" },
                mobility: { type: "string", enum: ["normal", "limited"], description: "User's mobility status" },
                independentLiving: { type: "string", enum: ["independent", "needs assistance"], description: "Independent living status" }
              }
            }
          }
        }
      },
      responses: {
        "200": {
          description: "Successful prediction",
          content: {
            "application/json": {
              example: {
                prediction: "Moderate Risk",
                probability: 0.35,
                riskFactors: ["Age > 65", "Memory Complaints", "Family History"],
                recommendation: "Consider consulting with a neurologist for a comprehensive evaluation.",
                modelStatus: "under_construction"
              }
            }
          }
        },
        "400": { description: "Missing required fields or invalid input" },
        "401": { description: "Unauthorized - User not authenticated" },
        "500": { description: "Server error during prediction processing" }
      }
    },
    
    {
      path: "/brain-scan/analyze",
      method: "POST",
      description: "Analyzes brain MRI scans for tumor detection or Alzheimer's detection",
      authentication: "Required - Clerk user authentication",
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              required: ["fileUrl", "scanType"],
              properties: {
                fileUrl: { 
                  type: "string", 
                  description: "Uploadcare CDN URL for the uploaded brain scan image" 
                },
                scanType: { 
                  type: "string", 
                  enum: ["tumor", "alzheimers"], 
                  description: "Type of analysis to perform" 
                }
              }
            }
          }
        }
      },
      responses: {
        "200": {
          description: "Analysis successfully queued",
          content: {
            "application/json": {
              example: {
                message: "Scan uploaded successfully and queued for analysis",
                assessmentId: "60f9a5b7c5b39a001234abcd",
                status: "processing",
                modelStatus: "processing",
                estimatedTime: "10-30 seconds"
              }
            }
          }
        },
        "400": { description: "Missing required fields or invalid input" },
        "401": { description: "Unauthorized - User not authenticated" },
        "500": { description: "Server error during scan processing" }
      }
    },
    
    {
      path: "/assessment/{id}",
      method: "GET",
      description: "Retrieves the status and results of a brain scan assessment",
      authentication: "Required - Clerk user authentication",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "Assessment ID returned from the brain-scan/analyze endpoint",
          schema: { type: "string" }
        }
      ],
      responses: {
        "200": {
          description: "Assessment information retrieved successfully",
          content: {
            "application/json": {
              example: {
                _id: "60f9a5b7c5b39a001234abcd",
                userId: "user_2x7aDFg9J3m1nOP5qR6stU",
                type: "tumor",
                result: "No Tumor Detected",
                risk: "low",
                data: {
                  fileUrl: "https://ucarecdn.com/7f9d5e6f-8c4b-4d2a-9e3f-1d2c4b5a6e7f/",
                  status: "completed",
                  submitted: "2023-11-20T15:30:00Z",
                  result: {
                    conclusion: "No Tumor Detected",
                    confidence: 0.95,
                    processingTime: "2023-11-20T15:30:30Z",
                    modelUsed: "Brain Tumor Detection"
                  }
                },
                date: "2023-11-20T15:30:00Z"
              }
            }
          }
        },
        "400": { description: "Invalid assessment ID" },
        "401": { description: "Unauthorized - User not authenticated" },
        "403": { description: "Forbidden - User does not have access to this assessment" },
        "404": { description: "Assessment not found" },
        "500": { description: "Server error during assessment retrieval" }
      }
    },
    
    {
      path: "/user/cognitive-scores",
      method: "POST",
      description: "Stores cognitive game results and calculates domain scores",
      authentication: "Required - Clerk user authentication",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["domain", "score", "source"],
              properties: {
                domain: { type: "string", enum: ["memory", "attention", "processingSpeed"], description: "Cognitive domain being assessed" },
                score: { type: "number", description: "Score achieved (typically 0-100)" },
                source: { type: "string", description: "Source of the score (e.g., 'memory-game', 'reaction-test')" },
                assessmentDate: { type: "string", format: "date-time", description: "Date and time of assessment (default: current time)" },
                notes: { type: "string", description: "Additional notes about the assessment" }
              }
            }
          }
        }
      },
      responses: {
        "200": {
          description: "Score successfully saved",
          content: {
            "application/json": {
              example: {
                success: true,
                cognitiveScore: {
                  domain: "memory",
                  score: 85,
                  previousScore: 80,
                  improvement: 5,
                  assessmentDate: "2023-11-20T15:30:00Z"
                }
              }
            }
          }
        },
        "400": { description: "Missing required fields or invalid input" },
        "401": { description: "Unauthorized - User not authenticated" },
        "404": { description: "User not found" },
        "500": { description: "Server error during score processing" }
      }
    },
    
    // Adding this endpoint based on likely functionality, update as needed
    {
      path: "/newsletter/subscribe",
      method: "POST",
      description: "Subscribe to the Brainwise newsletter",
      authentication: "Optional - Works for both authenticated and anonymous users",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email"],
              properties: {
                email: { type: "string", format: "email", description: "Email address to subscribe" },
                name: { type: "string", description: "Subscriber's name (optional)" },
                preferences: { 
                  type: "array", 
                  items: { type: "string" },
                  description: "Content preferences (e.g., 'brain-games', 'research', 'tips')" 
                }
              }
            }
          }
        }
      },
      responses: {
        "200": {
          description: "Successfully subscribed to newsletter",
          content: {
            "application/json": {
              example: {
                success: true,
                message: "Successfully subscribed to the Brainwise newsletter"
              }
            }
          }
        },
        "400": { description: "Invalid email or missing required fields" },
        "409": { description: "Email already subscribed" },
        "500": { description: "Server error during subscription processing" }
      }
    }
  ]
}; 