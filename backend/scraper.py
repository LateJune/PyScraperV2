import requests
import sys
import pymongo
from pymongo import MongoClient
from bs4 import BeautifulSoup

def main():
    soup, movie_title = setUpConnection()
    contents, img_url = findSoup(soup)
    if contents == None or img_url == None:
        print("Database not updated, " + movie_title + " does not exist or cannot be found")
        print("Try a diferent title.")
    else:
        small_movie_data = cleanMovieData(contents)
        entryInDb = dbConnect(img_url, movie_title, small_movie_data)
        if entryInDb == False:
            print("Database updated. " + movie_title.title() + " has been inserted.")
        else:
            print("Database has not been updated. " + movie_title.title() + " already exists." )


def setUpConnection():
    url = 'https://www.metacritic.com/movie/'
    #browser headers so get request is not blocked
    headers = {
    	'User-Agent': 'Mozilla/5.0',
    	'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    }
    
    # slices off the 1st arg which is the name of the file
    movie_title_list = sys.argv[1:]

    
    # get our title out of a list format and define the buffer to hyphenate it
    title_with_spaces = movie_title_list[0]
    hyphenated_title = ''

    # combine our input separated by a hyphen for the url
    for i in range(len(title_with_spaces)):

        # if a letter within title is a space add it to our hyphenated title buffer
        if title_with_spaces[i] == ' ':
            hyphenated_title = hyphenated_title + '-'

        # otherwise just add the next letter passed in
        else:
            hyphenated_title = hyphenated_title + title_with_spaces[i]
  
    # make all of the letters lowecase and append it to the url defined at beginning of the function
    movie_title = hyphenated_title.lower() 
    url = url + movie_title
    print("Url to scrape: " + url)

    page = requests.get(url, headers = headers)
    soup = BeautifulSoup(page.text, "html.parser")
    
    return soup, movie_title

def findSoup(soup):
    tagged_movie_image = soup.find_all("img", {"class":"summary_img"})
    tagged_movie_summary = soup.find_all("div", {"class":"details_section"})

    #Setting the beautifulSoup object to a string
    contents = ''
    for i in range(4):
        try:
            contents += str(tagged_movie_summary[i].text.encode('utf-8'))
        except IndexError:
            contents = None
            break

    #Find the url apart from the tags
    if tagged_movie_image != []:
        for attribute in tagged_movie_image:
            img_url = str(attribute['src'])
    else: 
        img_url = None

    return contents, img_url

def cleanMovieData(contents):
    # Remove excess whitespace and newlines
    while '  ' in contents:
        contents = contents.replace('  ', ' ')
    while '\n\n' in contents:
        contents = contents.replace('\n\n', '\n')

    movie_data_list = []
    buffer = []
    
    for ch in contents: 
        # If we have a new line put the buffer into summary and clear the buffer
        if ch == '\n':
            movie_data_list.append(''.join(buffer))
            buffer = []
        # Otherwise add the character to the buffer    
        else:
            buffer.append(ch)

    j = 0
    while j < len(movie_data_list):
        #Removing more whitespace
        if movie_data_list[j] == ' ' or movie_data_list[j] == '':     
            movie_data_list.pop(j)
        j += 1

    #Find the data that we want
    k = 0
    small_movie_data = []
    for element in movie_data_list:
        for ch in element:
            #Everything we need has an element that ends in a colon so we want the element after
            if ch == ':':
                small_movie_data.append(movie_data_list[k+1])
        k+=1
    return small_movie_data

def dbConnect(img_url, movie_title, small_movie_data):
    client = pymongo.MongoClient("mongodb://localhost:27017/")
    db = client["database_testing"]
    collection = db["movies"]
    isMovieInDb = True

    #Check database for entry. If none then entry does not exist yet
    if collection.find_one({"title": movie_title}) == None:
        isMovieInDb = False
        #Generate the movie object
        a_movie = {
            'img_url': img_url,
            'title': movie_title,
            'release_date': small_movie_data[0],
            'starring_actors': small_movie_data[1],
            'summary': small_movie_data[2],
            'director': small_movie_data[3],
            'genre': small_movie_data[4],
            'rating': small_movie_data[5],
            'runtime': small_movie_data[6],
        }

        #insert a movie into the database
        result = collection.insert_one(a_movie)
        client.close()

    else: 
        client.close()

    return isMovieInDb

# Start program by calling main
main()