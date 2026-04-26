// frontend/src/components/AddressFields.jsx
// КОМПОНЕНТ ПОЛЕЙ АДРЕСА С ПОДСКАЗКАМИ DADATA
import { useState } from 'react';
import styled from 'styled-components';
import { AddressSuggestions } from 'react-dadata';
import 'react-dadata/dist/react-dadata.css';

const InputGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.8rem;
  font-weight: 100;
  font-family: 'BlackerSans Pro', sans-serif;
  color: #5E524A;
  margin-bottom: 0.3rem;
  letter-spacing: 1px;
`;

const StyledAddressSuggestions = styled(AddressSuggestions)`
  width: 100%;
  
  & .react-dadata__input {
    width: 100%;
    padding: 0.7rem 1rem;
    border: 1px solid rgba(94, 82, 74, 0.3);
    border-radius: 12px;
    font-family: 'BlackerSans Pro', sans-serif;
    font-size: 0.9rem;
    font-weight: 100;
    background: white;
    
    &:focus {
      outline: none;
      border-color: #5E524A;
    }
  }
  
  & .react-dadata__suggestions {
    background: white;
    border-radius: 12px;
    margin-top: 0.3rem;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    font-family: 'BlackerSans Pro', sans-serif;
    z-index: 10;
  }
  
  & .react-dadata__suggestion {
    padding: 0.7rem 1rem;
    font-size: 0.85rem;
    
    &:hover {
      background: rgba(94, 82, 74, 0.05);
    }
  }
  
  & .react-dadata__suggestion--current {
    background: rgba(94, 82, 74, 0.1);
  }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 1rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.7rem 1rem;
  border: 1px solid rgba(94, 82, 74, 0.3);
  border-radius: 12px;
  font-family: 'BlackerSans Pro', sans-serif;
  font-size: 0.9rem;
  font-weight: 100;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #5E524A;
  }
`;

const AddressFields = ({ formData, onChange }) => {
  const [addressValue, setAddressValue] = useState(null);
  
  const DADATA_TOKEN = import.meta.env.VITE_DADATA_TOKEN;
  
  const handleAddressSelect = (suggestion) => {
    if (!suggestion) return;
    
    const address = suggestion.data;
    
    const updates = {};
    
    // Город
    if (address.city) {
      updates.shipping_city = address.city;
    } else if (address.settlement) {
      updates.shipping_city = address.settlement;
    } else if (address.region) {
      updates.shipping_city = address.region;
    }
    
    // Улица
    if (address.street) {
      updates.shipping_street = address.street;
    }
    
    // Дом
    if (address.house) {
      updates.shipping_house = address.house;
    }
    
    // Квартира
    if (address.flat) {
      updates.shipping_apartment = address.flat;
    }
    
    // Индекс
    if (address.postal_code) {
      updates.shipping_postal_code = address.postal_code;
    }
    
    onChange(updates);
    setAddressValue(suggestion);
  };
  
  const handleManualChange = (e) => {
    onChange({ [e.target.name]: e.target.value });
  };
  
  return (
    <>
      <InputGroup>
        <Label>Поиск адреса *</Label>
        <StyledAddressSuggestions
          token={DADATA_TOKEN}
          value={addressValue}
          onChange={handleAddressSelect}
          inputProps={{
            placeholder: 'Начните вводить адрес (город, улица)',
          }}
          count={10}
          minChars={3}
          delay={300}
        />
      </InputGroup>
      
      {/* Отображение заполненных полей */}
      {(formData.shipping_city || formData.shipping_street) && (
        <>
          <Row>
            <InputGroup>
              <Label>Город</Label>
              <Input
                type="text"
                name="shipping_city"
                value={formData.shipping_city || ''}
                onChange={handleManualChange}
                placeholder="Город"
              />
            </InputGroup>
            
            <InputGroup>
              <Label>Улица</Label>
              <Input
                type="text"
                name="shipping_street"
                value={formData.shipping_street || ''}
                onChange={handleManualChange}
                placeholder="Улица"
              />
            </InputGroup>
          </Row>
          
          <Row>
            <InputGroup>
              <Label>Дом *</Label>
              <Input
                type="text"
                name="shipping_house"
                value={formData.shipping_house || ''}
                onChange={handleManualChange}
                placeholder="Дом"
              />
            </InputGroup>
            <InputGroup>
              <Label>Квартира</Label>
              <Input
                type="text"
                name="shipping_apartment"
                value={formData.shipping_apartment || ''}
                onChange={handleManualChange}
                placeholder="Квартира"
              />
            </InputGroup>
          </Row>
          
          <Row>
            <InputGroup>
              <Label>Подъезд</Label>
              <Input
                type="text"
                name="shipping_entrance"
                value={formData.shipping_entrance || ''}
                onChange={handleManualChange}
                placeholder="Подъезд"
              />
            </InputGroup>
            <InputGroup>
              <Label>Этаж</Label>
              <Input
                type="text"
                name="shipping_floor"
                value={formData.shipping_floor || ''}
                onChange={handleManualChange}
                placeholder="Этаж"
              />
            </InputGroup>
          </Row>
          
          <InputGroup>
            <Label>Почтовый индекс</Label>
            <Input
              type="text"
              name="shipping_postal_code"
              value={formData.shipping_postal_code || ''}
              onChange={handleManualChange}
              placeholder="Индекс"
            />
          </InputGroup>
        </>
      )}
    </>
  );
};

export default AddressFields;