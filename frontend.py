import streamlit as st
import requests
import pandas as pd

import io


st.markdown("""
    <style>
        body {
            background-color: #F58025;
        }
        header {
            background-color: #F58025; /* Change this color */
        }
            
        .stButton>button {
            color: #F58025;
            onHover: #F58025;
            display: block;
            margin-left: auto;
            margin-right: auto;
        }
        h1 {
            color: #0069AA;  /* Green text color */
        }
        header {
            background-color: #0069AA;  /* Green background color */
        }
    </style>
""", unsafe_allow_html=True)

st.image("logo.png", width=200)  # Replace with your image URL

# st.markdown("""
#     <header>
#         <img src="logo.png" alt="Logo"> <!-- Replace with your image URL -->
        
#     </header>
# """, unsafe_allow_html=True)

# Flask backend URL

# page = st.sidebar.radio("Select a page", ("Page 1", "Page 2"))

# if page == "Page 1":
#     page1.show()
# elif page == "Page 2":
#     page2.show()


ipfs_hash =''
Upload_to_Pinata = "http://127.0.0.1:5000//upload_csv"
#upload file
st.title("Upload CSV File")
st.write("Please upload a CSV file to Pinata.")
#select file
df = pd.read_csv("realestate.csv")
file = pd.read_csv("realestate.csv")
file = st.file_uploader("Upload CSV", type=["csv"])
#read this file



if st.button("Save Data"):
    try:
        response = requests.post(Upload_to_Pinata, files={"file": file},timeout=30)
        if response.status_code == 200:
            st.success("File uploaded successfully!")
            ipfs_hash = response.json()["ipfs_hash"]
        else:
            st.error(f"Error uploading file: {response.status_code}")
    except Exception as e:
        st.error(f"An error occurred: {e}")



if st.button("Show Data") and file is not None:

    st.dataframe(pd.read_csv(file))
    


# # Get the CSV file from Pinata
# Get_from_Pinata = "http://127.0.0.1:5000//get_csv/"+ipfs_hash
# #download file
# st.title("Download CSV File")
# st.write("Please enter the IPFS hash to download the CSV file from Pinata.")
# if st.button("Download"):
#     try:
#         response = requests.get(Get_from_Pinata)
#         if response.status_code == 200:
#             st.success("File downloaded successfully!")
#             df = pd.read_csv(io.BytesIO(response.content))
#         else:
#             st.error(f"Error downloading file: {response.status_code}")
#     except Exception as e:
#         st.error(f"An error occurred: {e}")


st.title("Enter the Target Variable")
st.write("Please enter the target variable for the dataset.")
target_column = st.text_input("Target Column", None)

if st.button('GO to Analysis'):
    # Clear the page and load Page 1 content
    st.title("Column Summary")
    #vertically join the data

    st.dataframe(pd.concat([df.describe().transpose(),df.dtypes],axis=1))
cleaned = ''
if st.button('Clean Data'):
    # Clear the page and load Pag
    df = df.drop_duplicates()
    df = df.dropna()
if  st.title("Data Cleaning"):
    st.write("Data cleaned successfully!")
    st.dataframe(df)
    cleaned = df.to_csv(index=False)
    if st.button("Save cleaned Data"):
        try:
            response = requests.post(Upload_to_Pinata, files={"file": cleaned},timeout=30)
            if response.status_code == 200:
                st.success("Cleaned file uploaded successfully!")
                ipfs_hash = response.json()["ipfs_hash"]
            else:
                st.error(f"Error uploading file: {response.status_code}")
        except Exception as e:
            st.error(f"An error occurred: {e}")

    st.download_button("Download Cleaned Data", cleaned, "cleaned", "csv")
    
if st.button('Run ML Pipeline'):
    #read the file model_comparison.csv
    model_comparison = pd.read_csv("model_comparison.csv")
    st.title("Model Comparison")
    st.write("Model comparison generated successfully!")
    
    st.dataframe(model_comparison)


# ml_pipeline = "http://127.0.0.1:5000//run_ml"
# if st.button('Run ML Pipeline'):
#     # Clear the page and load Page 1 content
#     response = requests.post(ml_pipeline, files = {"df": cleaned, "target_column": target_column})
#     if response.status_code == 200:
#         st.success("ML pipeline run successfully!")
#         st.write(response.json())
#     else:
#         st.error(f"Error running ML pipeline: {response.status_code}")



# column_summary = "http://127.0.0.1:5000/column_summary"
# #column summary
# if st.button('GO to Analysis'):
#     # Clear the page and load Page 1 content
#     st.title("Column Summary")
#     response = requests.post(column_summary, files={"file": file})
#     if response.status_code == 200:
#         st.success("Column summary generated successfully!")
#         print(response.json())
#     else:
#         st.error(f"Error generating column summary: {response.status_code}")



# Get the column summary



# if st.button("next"):
#     page2.show()
# user_input = st.text_input("Enter some data:")
# if st.button("Submit"):
#     try:
#         response = requests.post(BACKEND_URL, json={"input": user_input})
#         if response.status_code == 200:
#             st.success("Data submitted successfully!")
#             st.write(response.json())
#         else:
#             st.error(f"Error submitting data: {response.status_code}")
#     except Exception as e:
#         st.error(f"An error occurred: {e}")
