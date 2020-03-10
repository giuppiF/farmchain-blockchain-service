pragma solidity ^0.4.24;

contract FarmContract
{
    address private owner;
    mapping(string => address) private products;
    mapping(string => address) private medias;

    constructor() public
    {
        owner = msg.sender;

    }

    modifier onlymanager()
    {
        require(msg.sender == owner);
        _;

    }

    function createProduct(string _name) public onlymanager
    {

        address product = new Product(_name);

        products[_name] = product;

    }/*
    function addMedia(string _filename,
                      string _timestamp,
                      string _longitude,
                      string _latitude) public onlymanager
    {

        address media = new Media(_filename, _timestamp, _longitude, _latitude);

        medias[_filename] = media;


    }*/

    function addMediaToProduct(string _media, string    filename,uint256  timestamp,uint256  longitude,uint256    latitude,
                               string _product) public onlymanager
    {

        address product_addr = products[_product];

        require(product_addr != 0x0, "Prodotto non trovato");

        Product product = Product(product_addr);
       // address media_addr = medias[_media];
        product.addMedia(_media, filename,timestamp,longitude,latitude);
    }
}


contract Product
{
    string public name;
    mapping(string => Media) medias;
    struct Media {
        string    filename;
        uint256  timestamp;
        uint256  longitude;
        uint256    latitude;
    }
    address private owner;

    modifier onlymanager()
    {
        require(msg.sender == owner);
        _;
    }

    constructor(string _name) public
    {
        // This will only be managed by the "father" contract ("CarrefourFactory"):
        owner = msg.sender;

        name = _name;
    }
    function addMedia(string _media, string    filename,uint256  timestamp,uint256  longitude,uint256    latitude) public onlymanager
    {
        medias[_media].filename = filename;
        medias[_media].timestamp = timestamp;
        medias[_media].longitude = longitude;
        medias[_media].latitude = latitude;
    }
    

}
/*
contract Media
{
    string   public filename;
    string public timestamp;
    string public longitude;
    string   public latitude;

    constructor(string   _filename,
                string _timestamp,
                string _longitude,
                string   _latitude) public
    {
        filename = _filename;
        timestamp = _timestamp;
        longitude = _longitude;
        latitude = _latitude;
    }
}

*/