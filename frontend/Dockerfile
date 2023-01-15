# Use an official Apache runtime as a parent image
FROM httpd:2.4

# Set the working directory
WORKDIR /usr/local/apache2/htdocs/

# Copy the frontend files to the appropriate location
COPY . .

# Make port 80 available to the world outside this container
EXPOSE 80

# Start the Apache server
CMD ["httpd-foreground"]
