# Quick Vagrant Setup
This is a vagrant shortcut to set up a Ubuntu Precise 32 box with most dev stuffs: 
LAMPPRNMR (Linux, Apache, Mysql, PHP, Python, Ruby, Node.js, Redis, MongoDb.

### Install Oracle VirtualBox

Download Here: [https://www.virtualbox.org/wiki/Downloads] (https://www.virtualbox.org/wiki/Downloads)

### Configure VirtualBox host-only adapter subnet

- Open the VirtualBox application and go to File->Preferences
- In preferences, click on Network
- Click the tab for Host-only Networks
- Add a new network if one doesn't already exist
- Click the screwdriver icon to edit the adapter settings
- Set the Host-only adapter IP address to 192.168.56.1
- Click the DHCP Server tab an deselect the "Enable Server" checkbox
- Save changes and exit.

### Install Vagrant

Download Here: [http://downloads.vagrantup.com/] (http://downloads.vagrantup.com/)

### Clone this project

	git clone git@github.com:djheru/express_boilerplate.git ./project_name
	
### Start the box (building if needed)

	cd ./project_name && vagrant up
	
(this will take a while)

### Edit your hosts file
	192.168.56.2	project-name #or whatever hostname you want
	
### Access your box via ssh

	vagrant ssh
	
### Pause your box

(remember to exit your ssh session)

	vagrant suspend
	
### Resume your box

	vagrant resume
	
### Shut down your box

	vagrant halt
	
### Destroy the box

	vagrant destroy
	
## Vagrant Docs
View Here: [http://docs.vagrantup.com/v2/getting-started/index.html] (http://docs.vagrantup.com/v2/getting-started/index.html)