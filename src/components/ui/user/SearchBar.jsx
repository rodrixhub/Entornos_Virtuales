import React, { useState, useEffect } from 'react';
import { eduAPI } from '../../../services';
import { useNavigate } from 'react-router-dom';
import { Input, AutoComplete, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Option } = AutoComplete;

export const SearchBar = () => {
    const [data, setData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [options, setOptions] = useState([]);
    const [selection, setSelection] = useState({});
    const navigate = useNavigate();

    const getAll = async () => {
        try {
            const videosResponse = await eduAPI.get('/video/video');
            const clasesResponse = await eduAPI.get('/clase/clase');
            const videos = videosResponse.data.video;
            const clases = clasesResponse.data.clase;
            setData([...videos, ...clases]);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        if (selection.type) {
            handleSearch();
        }
    }, [selection]);
    useEffect(() => {
        getAll();
    }, []);

    const handleSearch = () => {
        console.log('Filtered Data:', selection);
        if (selection.type === 'clase') {
            navigate(`/`);
        } else if (selection.type === 'video') {
            navigate(`/`);
        } else {
            // Manejar la situación en la que no se haya seleccionado nada
            console.log('No se ha seleccionado nada');
        }
    };

    const onSearch = (value) => {
        setSearchText(value);
        const filteredOptions = filterData(value);
        setOptions(filteredOptions);
    };
    
    

    const filterData = (value) => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;
        const filteredData = inputLength === 0 ? [] : data.filter(item =>
            item.name.toLowerCase().includes(inputValue)
        );
        console.log('Filtered Data:', filteredData); // Verificar los datos filtrados
        return filteredData.map(option => ({
            value: option.name,
            id: option.slug,
            type: option.type
        }));
    };

    const onSelect = (value, option) => {
        if (!option || !option.type) {
            console.error('Opción no válida:', option);
            return;
        }
    
        setSelection({ ...option });
        handleSearch(); // Redirigir después de seleccionar
    };
    
    
    
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <AutoComplete
                style={{ width: 300 }}
                options={options}
                onSelect={onSelect}
                onSearch={onSearch}
                placeholder="Buscar clases o videos"
                value={searchText}
            >
                <Input suffix={<Button type="primary" icon={<SearchOutlined />} onClick={handleSearch} />} />
            </AutoComplete>
        </div>
    );
};
