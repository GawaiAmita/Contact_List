import React, { useState } from 'react';
import './App.css';

const Header = () => {
  return (
    <div className="ui fixed menu">
      <div className="ui container center">
        <div className="Heading-Contact-Manager">
          <h2>Contact Manager</h2>
        </div>
      </div>
    </div>
  );
  };

const ContactCard = (props) => {
  const { contact } = props;
  const { id, name, number, email } = props.contact;

  const editContact = () => {
    props.editContact(id);
  };

  
  const deleteContact = (event) => {
    event.stopPropagation(); // Stop event propagation
  
    // Show the confirmation alert
    const confirmDelete = window.confirm('Delete contact from storage?');
    if (confirmDelete) {
      props.deleteContact(contact.id);
    }
  };
  

  const showContactDetails = () => {
    props.showContactDetails(props.contact);
  };

  return (
    <div className="item">
      <div className="user-icon">
        <i className="fa-solid fa-user-large"></i>
      </div>
      <div className="content-card">
        <div onClick={showContactDetails} className='name'>{name}</div>
        <div onClick={showContactDetails} className='number'>{number}</div>
        <div onClick={showContactDetails} className='email'>{email}</div>
      </div>
      <div  onClick={editContact}>
      <div className="user-edit-icon">
          <i className="fa-solid fa-pen"></i>
        </div>
      </div>
      <div  className="user-minus-icon" onClick={deleteContact}>
        <i className="fa-solid fa-user-minus"></i>
      </div>
    </div>
  );
};

const ContactList = (props) => {
  const [searchTerm, setSearchTerm] = useState('');

  const editContactHandler = (id) => {
    props.editContact(id);
  };

  const deleteContactHandler = (id) => {
    props.deleteContact(id);
  };

  const showContactDetails = (contact) => {
    props.showContactDetails(contact);
  };

  const renderContactList = props.contacts
    .filter(
      (contact) =>
        Object.values(contact)
          .join(' ')
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    )
    .map((contact) => (
      <div
        key={contact.id}
        onClick={() => showContactDetails(contact)}
        className="contact-details"
      >
        <ContactCard
          contact={contact}
          editContact={editContactHandler}
          deleteContact={deleteContactHandler}
          showContactDetails={showContactDetails}
        />
      </div>
    ));

  const getSearchTerm = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="ui-celled-list">
      <div className="search-bar">
        <div className="icon-input">
          <input
            type="text"
            placeholder="Search your contact here!"
            className="prompt"
            value={searchTerm}
            onChange={getSearchTerm}
          />
        </div>
      </div>

      {!props.showAddContact && (
        <button className="add-button" onClick={props.toggleAddContact}>
          Add
        </button>
      )}

      <div className="Heading-Contact-List">
        <h3>Contact List</h3>
      </div>
      {renderContactList.length > 0 ? (
        renderContactList
      ) : (
        <p className="mismatch">No contact is available</p>
      )}
    </div>
  );
};


const AddContacts = (props) => {
  const [state, setState] = useState({
    name: props.contactToEdit ? props.contactToEdit.name : '',
    number: props.contactToEdit ? props.contactToEdit.number : '',
    email: props.contactToEdit ? props.contactToEdit.email : '',
  });

  const add = (e) => {
    e.preventDefault();

    if (state.name === '' || state.number === '') {
      alert('Name & Number is required!');
      return;
    }

    if (props.contactToEdit) {
      const updatedContact = {
        id: props.contactToEdit.id,
        ...state,
      };
      props.addContactHandler(updatedContact);
    } else {
      const newContact = {
        id: new Date().getTime().toString(),
        ...state,
      };
      props.addContactHandler(newContact);
    }

    setState({ name: '', number: '', email: '' });
    props.toggleAddContact();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const goBack = () => {
    setState({ name: '', number: '', email: '' });
    props.toggleAddContact();
  };

  return (
    <div className="ui main">
      <h2 className="AddContact-Heading">
        {props.contactToEdit ? 'Edit Contact' : 'Add Contact'}
      </h2>
      <form className="ui form" onSubmit={add}>
        <div className="field">
          <label>Name</label>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={state.name}
            onChange={handleChange}
          />
        </div>
        <div className="field">
          <label>Number</label>
          <input
            type="text"
            name="number"
            placeholder="Number"
            value={state.number}
            onChange={handleChange}
          />
        </div>
        <div className="field">
          <label>Email</label>
          <input
            type="text"
            name="email"
            placeholder="Email"
            value={state.email}
            onChange={handleChange}
          />
        </div>
        <button className="ui-button-Add">
          {props.contactToEdit ? 'Update' : 'Add'}
        </button>
        <button className="back-btn" onClick={goBack}>
          Back
        </button>
      </form>
    </div>
  );
};

const ContactDetails = (props) => {
  const { contact } = props;

  const goBack = () => {
    props.toggleContactList(false);
  };

  const editContact = () => {
    props.editContact(contact.id);
  };

  if (!contact) {
    return null;
  }

  const { name, number, email } = contact;

  return (
    <div className="main-contact-details">
      <h2 className="header-d">Contact Details</h2>
      <div className="card-contact-details">
      
      <div className="user-img">
        <i className="fa-solid fa-user-large"></i>
      </div>
      <div className="contents-d">
        <div className="description-name">Name: {name}</div>
        <div className="description">Number: {number}</div>
        <div className="description">Email: {email}</div>
        <button className="back-btn-d" onClick={goBack}>
          Back
        </button>
        <button className="back-btn-d" onClick={editContact}>
          Edit
        </button>
        
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [contacts, setContacts] = useState([]);
  const [showAddContact, setShowAddContact] = useState(false);
  const [editContactId, setEditContactId] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [showDetailsPage, setShowDetailsPage] = useState(false);

  const addContactHandler = (contact) => {
    if (editContactId) {
      const updatedContacts = contacts.map((c) =>
        c.id === editContactId ? contact : c
      );
      setContacts(updatedContacts);
    } else {
      setContacts([...contacts, contact]);
    }
    setShowAddContact(false);
    setEditContactId('');
    setSelectedContact(null);
    setShowDetailsPage(false);
  };

  const toggleAddContact = () => {
    setShowAddContact(!showAddContact);
    setEditContactId('');
    setSelectedContact(null);
    setShowDetailsPage(false);
  };

  const toggleContactList = (show) => {
    setShowDetailsPage(show);
    setShowAddContact(false);
    setEditContactId('');
    setSelectedContact(null);
  };

  const editContact = (id) => {
    const contactToEdit = contacts.find((contact) => contact.id === id);
    if (contactToEdit) {
      setEditContactId(id);
      setSelectedContact(contactToEdit);
      setShowAddContact(true);
      setShowDetailsPage(false);
    }
  };

  const deleteContact = (id) => {
    const updatedContacts = contacts.filter((contact) => contact.id !== id);
    setContacts(updatedContacts);
    if (selectedContact && selectedContact.id === id) {
      setSelectedContact(null);
      setShowDetailsPage(false);
    }
  };

  const showContactDetails = (contact) => {
    if (!showAddContact) {
      setSelectedContact(contact);
      setShowDetailsPage(true);
    }
  };

  return (
    <div className="js-files-in-app.js">
      <Header />
      
        {showAddContact ? (
          <AddContacts
            addContactHandler={addContactHandler}
            toggleAddContact={toggleAddContact}
            contactToEdit={selectedContact}
          />
        ) : showDetailsPage ? (
          <ContactDetails
            contact={selectedContact}
            toggleContactList={toggleContactList}
            editContact={editContact}
            deleteContact={deleteContact}
          />
        ) : (
          <ContactList
            contacts={contacts}
            editContact={editContact}
            showContactDetails={showContactDetails}
            toggleAddContact={toggleAddContact}
            showAddContact={showAddContact}
            deleteContact={deleteContact}
          />
        )}
      </div>
    
  );
};

export default App;
