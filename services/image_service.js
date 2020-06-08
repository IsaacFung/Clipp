import firebase from '../Firebase.js'
import Stitch from '../Mongo.js'
import {RemoteMongoClient} from "mongodb-stitch-react-native-sdk";

export default class ImageService {
    static instance = new ImageService();

    static uploadImage(product_image_path, product_image_num, product_image_uri) {
        return ImageService.instance.uploadImage(product_image_path, product_image_num, product_image_uri);
    }

    static uploadMetadata(product_metadata) {
        return ImageService.instance.uploadMetadata(product_metadata);
    }

    static uploadMetadataMongo(product_metadata) {
        return ImageService.instance.uploadMetadataMongo(product_metadata);
    }

    static retrieveAllProductsForUser() {
        return ImageService.instance.retrieveAllProductsForUser();
    }

    static retrieveAllProductsForUserMongo() {
        return ImageService.instance.retrieveAllProductsForUserMongo();
    }

    static retrieveAllProductNamesForUser() {
        return ImageService.instance.retrieveAllProductNamesForUser();
    }

    static retrieveAllProductNamesForUserMongo() {
        return ImageService.instance.retrieveAllProductNamesForUserMongo();
    }

    static retrieveAllImagesForProduct(imagePath) {
        return ImageService.instance.retrieveAllImagesForProduct(imagePath);
    }

//const query1 = {$and: [{'metadata.username':username}, {'metadata.imagePath':product1_image_path}]}

    static retrieveTopImagesForCategory(category, item_path) {
        return ImageService.instance.retrieveTopImagesForCategory(category, item_path);
    }

    static retrieveTopImagesForCategoryMongo(category, item_path) {
        return ImageService.instance.retrieveTopImagesForCategoryMongo(category, item_path);
    }

    static updateSwipe(product_image_path, swiped_product_image_path, right) {
        return ImageService.instance.updateSwipe(product_image_path, swiped_product_image_path, right);
    }

    static updateSwipeMongo(product_image_path, swiped_product_image_path, right) {
        return ImageService.instance.updateSwipeMongo(product_image_path, swiped_product_image_path, right);
    }

    static updateData(product_image_path, update_obj) {
        return ImageService.instance.updateData(product_image_path, update_obj);
    }

    static updateDataMongo(product_image_path, update_obj) {
        return ImageService.instance.updateDataMongo(product_image_path, update_obj);
    }

    static updateMatch(product_image_path) {
        return ImageService.instance.updateMatch(product_image_path);
    }

    static updateMatchMongo(product_image_path) {
        return ImageService.instance.updateMatchMongo(product_image_path);
    }

    static updateSoldMongo(product_image_path) {
        return ImageService.instance.updateSoldMongo(product_image_path);
    }

    static checkMatch(product1_image_path, product2_image_path) {
        return ImageService.instance.checkMatch(product1_image_path, product2_image_path);
    }

    static checkMatchMongo(product1_image_path, product2_image_path) {
        return ImageService.instance.checkMatchMongo(product1_image_path, product2_image_path);
    }

    static deleteImagesOfItem(product_image_path) {
        return ImageService.instance.deleteImagesOfItem(product_image_path);
    }

    static deleteItemAndMetadata(product_image_path) {
        return ImageService.instance.deleteItemAndMetadata(product_image_path);
    }

    static deleteItemAndMetadataMongo(product_image_path) {
        return ImageService.instance.deleteItemAndMetadataMongo(product_image_path);
    }

    static retrieveMetadataForObjectMongo(imagePath) {
        return ImageService.instance.retrieveMetadataForObjectMongo(imagePath);
    }

    uploadImage(product_image_path, product_image_num, product_image_uri) {
        console.log("uploading images");
        return new Promise((resolve, reject) => {
            const storageRef = firebase.storage().ref();
            const tempRef = storageRef.child(product_image_path + '/img_' + product_image_num + '.png');

            const xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            xhr.open('GET', product_image_uri, true);
            xhr.onload = function () {
                if (this.status >= 200 && this.status < 300) {
                    tempRef.put(xhr.response)
                        .then(() => {
                            resolve(true)
                        })
                        .then(() => {
                            xhr.response.close()
                        })
                        .catch((err) => {
                            reject(err)
                        })
                } else {
                    reject({
                        status: this.status,
                        statusText: xhr.statusText
                    });
                }
            };
            xhr.onerror = function () {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            };
            xhr.send();
        })
    }

    uploadMetadata(product_metadata) {
        return new Promise((resolve, reject) => {
            console.log("Uploaded metadata to Firestore");
            const db = firebase.firestore();
            db.collection("products").add({
                categories: product_metadata.categories,
                categoriesInterested: product_metadata.categoriesInterested,
                imagePath: product_metadata.imagePath,
                isSold: product_metadata.isSold,
                priceHigh: product_metadata.priceHigh,
                priceLow: product_metadata.priceLow,
                swipedLeft: product_metadata.swipedLeft,
                swipedRight: product_metadata.swipedRight,
                username: product_metadata.username,
                productName: product_metadata.productName,
                eloRank: product_metadata.eloRank,
                description: product_metadata.description,
                isMatched: product_metadata.isMatched,
                displayName: product_metadata.displayName,
            }).then(() => {
                resolve()
            }).catch((err) => {
                reject(err)
            })

        })
    }

    uploadMetadataMongo(product_metadata) {
        return new Promise((resolve, reject) => {
            console.log("Uploaded metadata to Mongo");

            const stitchAppClient = Stitch.defaultAppClient;
            const mongoClient = stitchAppClient.getServiceClient(
                RemoteMongoClient.factory,
                "mongodb-atlas"
            );
            const db = mongoClient.db("clipp_app");
            const products = db.collection("products");

            const uploadedProduct = {
                categories: product_metadata.categories,
                categoriesInterested: product_metadata.categoriesInterested,
                imagePath: product_metadata.imagePath,
                isSold: product_metadata.isSold,
                priceHigh: product_metadata.priceHigh,
                priceLow: product_metadata.priceLow,
                swipedLeft: product_metadata.swipedLeft,
                swipedRight: product_metadata.swipedRight,
                username: product_metadata.username,
                productName: product_metadata.productName,
                eloRank: product_metadata.eloRank,
                description: product_metadata.description,
                isMatched: product_metadata.isMatched,
                displayName: product_metadata.displayName,
            };

            products.insertOne({
                owner_id: stitchAppClient.auth.user.id,
                metadata: uploadedProduct,
            }).then(() => {
                resolve()
            }).catch((err) => {
                reject(err)
            })
        })
    }

    /**
     * Mark's
     */
    updateSwipe(product_image_path, swiped_product_image_path, right) {
        return new Promise((resolve, reject) => {
            console.log("Updating swipes for", product_image_path);
            const db = firebase.firestore();
            db.collection("products").where("imagePath", "==", product_image_path)
                .get()
                .then(querySnapshot => {
                    querySnapshot.forEach(doc => {
                        console.log("Product data is", doc.data());
                        if (right) {
                            console.log("Updating Right Array");
                            db.collection("products").doc(doc.id)
                                .update({swipedRight: firebase.firestore.FieldValue.arrayUnion(swiped_product_image_path)}).then(r => console.log(r));
                            console.log("Objected Successfully Updated")
                        } else {
                            console.log("Updating Left Array");
                            db.collection("products").doc(doc.id)
                                .update({swipedLeft: firebase.firestore.FieldValue.arrayUnion(swiped_product_image_path)}).then(r => console.log(r));
                            console.log("Objected Successfully Updated")
                        }
                        resolve()
                    });
                }).catch((err) => {
                reject(err)
            })
        })
    }

    updateSwipeMongo(product_image_path, swiped_product_image_path, right) {
        return new Promise((resolve, reject) => {
            console.log("Updating swipes for", product_image_path);
            const stitchAppClient = Stitch.defaultAppClient;
            const mongoClient = stitchAppClient.getServiceClient(
                RemoteMongoClient.factory,
                "mongodb-atlas"
            );
            const db = mongoClient.db("clipp_app");
            const products = db.collection("products");

            const query = {'metadata.imagePath': swiped_product_image_path};
            const updateRight = {"$addToSet": {"metadata.swipedRight": product_image_path}};
            const updateLeft = {"$addToSet": {"metadata.swipedLeft": product_image_path}};

            if (right) {
                console.log("Updating Right Array");
                products.updateOne(query, updateRight).then(() => {
                    console.log("Objected Successfully Updated");
                    resolve()
                })
                    .catch(err => {
                        reject(err)
                    })
            } else {
                console.log("Updating Right Array");
                products.updateOne(query, updateLeft).then(() => {
                    console.log("Objected Successfully Updated");
                    resolve()
                })
                    .catch(err => {
                        reject(err)
                    })
            }
        })
    }

    updateMatch(product_image_path) {
        return new Promise((resolve, reject) => {
            console.log("Updating swipes for", product_image_path);
            const db = firebase.firestore();
            db.collection("products").where("imagePath", "==", product_image_path)
                .get()
                .then(querySnapshot => {
                    querySnapshot.forEach(doc => {
                        console.log("Product data is", doc.data());
                        db.collection("products").doc(doc.id)
                            .update({isMatched: true}).then(r => console.log(r));
                        console.log("Objected Successfully Updated");
                        resolve()
                    });
                }).catch((err) => {
                reject(err)
            })
        })
    }

    updateMatchMongo(product_image_path) {
        return new Promise((resolve, reject) => {
            console.log("Updating swipes for", product_image_path);
            const stitchAppClient = Stitch.defaultAppClient;
            const mongoClient = stitchAppClient.getServiceClient(
                RemoteMongoClient.factory,
                "mongodb-atlas"
            );
            const db = mongoClient.db("clipp_app");
            const products = db.collection("products");

            const query = {'metadata.imagePath': product_image_path};
            const updateMatch = {"$set": {"metadata.isMatched": true}};

            products.updateOne(query, updateMatch)
                .then(() => {
                    console.log("Objected Successfully Updated");
                    resolve()
                })
                .catch(err => {
                    reject(err)
                })
        })
    }

    updateSoldMongo(product_image_path) {
        return new Promise((resolve, reject) => {
            console.log("Updating Sold for", product_image_path);
            const stitchAppClient = Stitch.defaultAppClient;
            const mongoClient = stitchAppClient.getServiceClient(
                RemoteMongoClient.factory,
                "mongodb-atlas"
            );
            const db = mongoClient.db("clipp_app");
            const products = db.collection("products");

            const query = {'metadata.imagePath': product_image_path};
            const updateSold = {"$set": {"metadata.isSold": true}};

            products.updateOne(query, updateSold)
                .then(() => {
                    console.log("Objected Successfully Updated");
                    resolve()
                })
                .catch(err => {
                    reject(err)
                })
        })
    }

    checkMatch(product1_image_path, product2_image_path) {
        return new Promise((resolve, reject) => {
            console.log("Checking match between", product1_image_path, product2_image_path);
            let swipedRight1 = [];
            let swipedRetrieved1 = false;
            let swipedRightObj1 = null;
            let swipedRight2 = [];
            let swipedRetrieved2 = false;
            let swipedRightObj2 = null;

            let promises = [];
            const db = firebase.firestore();
            promises.push(db.collection("products").where("imagePath", "==", product1_image_path)
                .get()
                .then(querySnapshot => {
                    querySnapshot.forEach(doc => {
                        console.log("Retrieved product 1.");
                        swipedRight1 = doc.data().swipedRight;
                        swipedRightObj1 = doc.data();
                        swipedRetrieved1 = true
                    })
                }).catch((err) => {
                    reject(err)
                })
            );
            promises.push(db.collection("products").where("imagePath", "==", product2_image_path)
                .get()
                .then(querySnapshot => {
                    querySnapshot.forEach(doc => {
                        console.log("Retrieved product 2.");
                        swipedRight2 = doc.data().swipedRight;
                        swipedRightObj2 = doc.data();
                        swipedRetrieved2 = true
                    })
                }).catch((err) => {
                    reject(err)
                })
            );
            Promise.all(promises).then(() => {
                console.log(swipedRight1, swipedRight2);
                if (swipedRight1.includes(product2_image_path) && swipedRight2.includes(product1_image_path)) {
                    this.retrieveCoverImage(swipedRightObj2.imagePath, swipedRightObj2).then(product_obj => {
                        console.log("Found a match. Sending matched product");
                        resolve(product_obj)
                    })
                } else {
                    console.log("Did not find a match.");
                    resolve(null)
                }
            })
        })
    }

    checkMatchMongo(product1_image_path, product2_image_path) {
        return new Promise((resolve, reject) => {
            console.log("Checking match between", product1_image_path, product2_image_path);
            let swipedRight1 = [];
            let swipedRetrieved1 = false;
            let swipedRightObj1 = null;
            let swipedRight2 = [];
            let swipedRetrieved2 = false;
            let swipedRightObj2 = null;

            const stitchAppClient = Stitch.defaultAppClient;
            const mongoClient = stitchAppClient.getServiceClient(
                RemoteMongoClient.factory,
                "mongodb-atlas"
            );
            const db = mongoClient.db("clipp_app");
            const products = db.collection("products");

            let promises = [];
            const query1 = {'metadata.imagePath': product1_image_path};
            promises.push(products.find(query1).asArray()
                .then(docs => {
                    docs.forEach(doc => {
                        console.log("Retrieved product 1.");
                        swipedRight1 = doc.metadata.swipedRight;
                        swipedRightObj1 = doc.metadata;
                        swipedRetrieved1 = true
                    })
                })
                .catch(err => {
                    reject(err)
                })
            );
            const query2 = {'metadata.imagePath': product2_image_path};
            promises.push(products.find(query2).asArray()
                .then(docs => {
                    docs.forEach(doc => {
                        console.log("Retrieved product 2.");
                        swipedRight2 = doc.metadata.swipedRight;
                        swipedRightObj2 = doc.metadata;
                        swipedRetrieved2 = true
                    })
                })
                .catch(err => {
                    reject(err)
                })
            );

            Promise.all(promises).then(() => {
                console.log(swipedRight1, swipedRight2);
                if (swipedRight1.includes(product2_image_path) && swipedRight2.includes(product1_image_path)) {
                    this.retrieveCoverImage(swipedRightObj2.imagePath, swipedRightObj2).then(product_obj => {
                        console.log("Found a match. Sending matched product");
                        resolve(product_obj)
                    })
                } else {
                    console.log("Did not find a match.");
                    resolve(null)
                }
            })
        })
    }

    updateData(product_image_path, update_obj) {
        const db = firebase.firestore();
        db.collection("products").where("imagePath", "==", product_image_path)
            .get()
            .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    db.collection("products").doc(doc.id).set(update_obj).then(r => console.log(r));
                });
            })
    }

    updateDataMongo(product_image_path, update_obj) {
        const stitchAppClient = Stitch.defaultAppClient;
        const mongoClient = stitchAppClient.getServiceClient(
            RemoteMongoClient.factory,
            "mongodb-atlas"
        );
        const db = mongoClient.db("clipp_app");
        const products = db.collection("products");

        const query = {"metadata.imagePath": product_image_path};
        const updateData = {"owner_id": stitchAppClient.auth.user.id, "metadata": update_obj};

        products.findOneAndReplace(query, updateData)
            .then(() => {
                console.log("Successfully update object")
            })
    }

    /**
     * Doesn't use mongo
     */
    retrieveCoverImage(product_obj_image_path, product_obj) {
        console.log("Starting to retrieve cover picture for product");
        return new Promise((resolve, reject) => {
            const storageRef = firebase.storage().ref();
            const imageRef = storageRef.child(product_obj_image_path + '/img_0.png');
            imageRef.getDownloadURL()
                .then(url => {
                    const data = {url: url, data: product_obj};
                    resolve(data)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }

    retrieveAllProductsForUser() {
        return new Promise((resolve, reject) => {
            const user = firebase.auth().currentUser;

            const storage = firebase.storage();
            let username = user.email;
            username = username.substring(0, username.indexOf('@'));
            const db = firebase.firestore();
            let promises = [];
            let product_data = [];
            db.collection("products").where("username", "==", username)
                .get()
                .then(querySnapshot => {
                    querySnapshot.forEach(function (doc) {
                        const storageRef = storage.ref();
                        const imageRef = storageRef.child(doc.data().imagePath + '/img_0.png');
                        console.log("Pushing all firebase promises to Promise");
                        promises.push(imageRef.getDownloadURL()
                            .then(url => {
                                const data = {url: url, data: doc.data()};
                                product_data.push(data)
                            })
                            .catch(err => {
                                reject(err)
                            })
                        )
                    });
                })
                .then(() => {
                    console.log("Executing all promises");
                    Promise.all(promises)
                        .then(() => {
                            console.log("Sending formatted product data.");
                            resolve(product_data)
                        })
                })
                .catch(function (err) {
                    reject(err)
                });
        })
    }

    retrieveAllProductsForUserMongo() {
        return new Promise((resolve, reject) => {
            const user = firebase.auth().currentUser;

            const storage = firebase.storage();
            let username = user.email;
            username = username.substring(0, username.indexOf('@'));
            let promises = [];
            let product_data = [];

            const stitchAppClient = Stitch.defaultAppClient;
            const mongoClient = stitchAppClient.getServiceClient(
                RemoteMongoClient.factory,
                "mongodb-atlas"
            );
            const db = mongoClient.db("clipp_app");
            const products = db.collection("products");

            const query = {'metadata.username': username};
            products.find(query).asArray()
                .then(docs => {
                    docs.forEach(doc => {
                        const storageRef = storage.ref();
                        const imageRef = storageRef.child(doc.metadata.imagePath + '/img_0.png');
                        console.log("Pushing all firebase promises to Promise");
                        promises.push(imageRef.getDownloadURL()
                            .then(url => {
                                const data = {url: url, data: doc.metadata};
                                product_data.push(data)
                            })
                            .catch(err => {
                                reject(err)
                            })
                        )
                    })
                })
                .then(() => {
                    console.log("Executing all promises");
                    Promise.all(promises)
                        .then(() => {
                            console.log("Sending formatted product data.", product_data);
                            resolve(product_data)
                        })
                })
                .catch(function (err) {
                    reject(err)
                });
        })
    }

    retrieveAllProductNamesForUser() {
        console.log("Starting to retrieve all products for user");
        return new Promise((resolve, reject) => {
            const user = firebase.auth().currentUser;

            const storage = firebase.storage();
            let username = user.email;
            username = username.substring(0, username.indexOf('@'));
            const db = firebase.firestore();
            let promises = [];
            let product_names = [];
            db.collection("products").where("username", "==", username)
                .get()
                .then(querySnapshot => {
                    querySnapshot.forEach(function (doc) {
                        const storageRef = storage.ref();
                        const imageRef = storageRef.child(doc.data().imagePath + '/img_0.png');
                        console.log("Pushing all firebase promises to Promise");
                        promises.push(imageRef.getDownloadURL()
                            .then(url => {
                                console.log(url);
                                product_names.push(doc.data().productName)
                            })
                            .catch(err => {
                                reject(err)
                            })
                        )
                    });
                })
                .then(() => {
                    console.log("Executing all promises");
                    Promise.all(promises)
                        .then(() => {
                            console.log("Sending formatted product names.");
                            resolve(product_names)
                        })
                })
                .catch(function (err) {
                    reject(err)
                });
        })
    }

    retrieveAllProductNamesForUserMongo() {
        console.log("Starting to retrieve all products for user");
        return new Promise((resolve, reject) => {
            const user = firebase.auth().currentUser;
            console.log(user);

            let username = user.email;
            username = username.substring(0, username.indexOf('@'));

            const stitchAppClient = Stitch.defaultAppClient;
            const mongoClient = stitchAppClient.getServiceClient(
                RemoteMongoClient.factory,
                "mongodb-atlas"
            );
            const db = mongoClient.db("clipp_app");
            const products = db.collection("products");
            let product_names = [];

            const query = {'metadata.username': username};
            products.find(query).asArray()
                .then(docs => {
                    docs.forEach(doc => {
                        console.log("Pushing all names into product_names");
                        product_names.push(doc.metadata.productName)
                    })
                })
                .then(() => {
                    resolve(product_names)
                })
                .catch(function (err) {
                    reject(err)
                });
        })
    }

    retrieveAllImagesForProduct(product_image_path) {
        return new Promise((resolve) => {
            console.log("Starting to retrieve all images for", product_image_path);
            let promises = [];
            let uris = [];
            const storageRef = firebase.storage().ref(product_image_path);
            storageRef.listAll()
                .then((result) => {
                    result.items.forEach((imageRef) => {
                        console.log("Pushing promises into list.");
                        promises.push(imageRef.getDownloadURL()
                            .then((url) => {
                                console.log("Getting uris per image.", uris);
                                uris.push(url)
                            })
                        )
                    })
                })
                .then(() => {
                    console.log("Executing all promises");
                    Promise.all(promises)
                        .then(() => {
                            console.log("Sending images uris.", uris);
                            resolve(uris)
                        })
                })
        })
    }

    retrieveTopImagesForCategory(category, item_path) {
        console.log("Starting to retrieve top 5 products for a match with", item_path);
        return new Promise((resolve, reject) => {
            const user = firebase.auth().currentUser;
            let username = user.email;
            username = username.substring(0, username.indexOf('@'));
            const db = firebase.firestore();
            let paths = [];
            let products = [];
            console.log("Retrieving object for", item_path);
            db.collection("products").where("imagePath", "==", item_path)
                .get()
                .then(querySnapshot => {
                    querySnapshot.forEach(current_image => {
                        current_image = current_image.data();
                        db.collection("products")
                            .get()
                            .then(querySnapshot2 => {
                                querySnapshot2.forEach(doc => {
                                    if (doc.data().username !== username && !doc.data().isSold && !this.alreadySeen(doc.data().imagePath, current_image.swipedLeft, current_image.swipedRight)) {
                                        console.log("Pushing product objects to products returned.");
                                        paths.push({data: doc.data(), image_path: doc.data().imagePath})
                                    }
                                })
                            })
                            .then(() => {
                                paths.reduce((promise, obj) => {
                                        return promise
                                            .then((uris) => {
                                                console.log(uris);
                                                return this.retrieveAllImagesForProduct(obj.image_path).then(uris => {
                                                    console.log("Pushing product object for", obj.image_path);
                                                    let product = {data: obj.data, uris: uris};
                                                    products.push(product);
                                                    if (products.length === paths.length) {
                                                        console.log("Resolving promise. Return to client.");
                                                        resolve(products)
                                                    }
                                                })
                                            })
                                    }, Promise.resolve()
                                )
                            })

                    })
                })
                .catch(err => {
                    reject(err)
                });
        })
    }

    retrieveTopImagesForCategoryMongo(category, item_path) {
        console.log("Starting to retrieve top 5 products for a match with", item_path);
        return new Promise((resolve, reject) => {
            const user = firebase.auth().currentUser;
            let username = user.email;
            username = username.substring(0, username.indexOf('@'));
            let paths = [];
            let products = [];
            const stitchAppClient = Stitch.defaultAppClient;
            const mongoClient = stitchAppClient.getServiceClient(
                RemoteMongoClient.factory,
                "mongodb-atlas"
            );

            console.log("CLIENT ID", stitchAppClient.auth.user.id)

            const db = mongoClient.db("clipp_app");
            const products2 = db.collection("products");

            const query = [{$sample: {size: 20}}, {
                $match: {
                    $and: [{"metadata.username": {$ne: username}},
                        {"metadata.swipedRight": {$nin: [item_path]}}, {"metadata.swipedLeft": {$nin: [item_path]}},
                        {"metadata.isMatched": false}, {"metadata.isSold": false}]
                }, 
            }, {$limit: 5}];
            console.log(query)

            console.log("Retrieving object for", item_path);
            products2.aggregate(query).asArray()
                .then(docs => {
                    if (docs.length == 0){
                        console.log("No More Item")
                        resolve(products)
                    }
                    docs.forEach(doc => {
                        console.log("Pushing product objects to products returned.");
                        paths.push({data: doc.metadata, image_path: doc.metadata.imagePath})
                    })
                })
                .then(() => {
                    paths.reduce((promise, obj) => {
                            return promise
                                .then((uris) => {
                                    console.log(uris);
                                    return this.retrieveAllImagesForProduct(obj.image_path).then(uris => {
                                        console.log("Pushing product object for", obj.image_path);
                                        let product = {data: obj.data, uris: uris};
                                        products.push(product);
                                        if (products.length === paths.length) {
                                            console.log("Resolving promise. Return to client.");
                                            resolve(products)
                                        }
                                    })
                                })
                        }, Promise.resolve()
                    )
                })
                .catch(err => {
                    reject(err)
                });
        })
    }

    deleteImagesOfItem(product_image_path) {
        console.log("Deleting old images");
        return new Promise((resolve, reject) => {
            const storageRef = firebase.storage().ref(product_image_path);
            let promises = [];
            storageRef.listAll()
                .then((result) => {
                    result.items.forEach((imageRef) => {
                        console.log("Pushing promises into list.");
                        promises.push(imageRef.delete().then(() => {
                                console.log("deleted image")
                            })
                        )
                    })
                })
                .then(() => {
                    console.log("Executing all promises");
                    Promise.all(promises)
                        .then(() => {
                            resolve(true)
                        })
                })
                .catch(err => {
                    reject(err)
                })
        })
    }

    /**
     * Mark's
     */
    deleteItemAndMetadata(product_image_path) {
        console.log("Deleting pictures of product but not folder");
        return new Promise((resolve, reject) => {
            const storageRef = firebase.storage().ref(product_image_path);
            let promises = [];
            const db = firebase.firestore();
            storageRef.listAll()
                .then((result) => {
                    result.items.forEach((imageRef) => {
                        console.log("Pushing promises into list.");
                        promises.push(imageRef.delete().then(() => {
                                console.log("deleted image")
                            })
                        )
                    })
                })
                .then(() => {
                    console.log("Executing all promises");
                    Promise.all(promises)
                        .then(() => {
                            console.log("Deleting metadata");
                            db.collection("products").where("imagePath", "==", product_image_path)
                                .get()
                                .then(querySnapshot => {
                                    querySnapshot.forEach(doc => {
                                        doc.ref.delete().then(() => {
                                            resolve(product_image_path)
                                        })
                                    })
                                })
                        })
                })
                .catch(err => {
                    reject(err)
                })
        })
    }

    deleteItemAndMetadataMongo(product_image_path) {
        console.log("Deleting pictures of product but not folder");
        return new Promise((resolve, reject) => {
            const storageRef = firebase.storage().ref(product_image_path);
            let promises = [];
            const stitchAppClient = Stitch.defaultAppClient;
            const mongoClient = stitchAppClient.getServiceClient(
                RemoteMongoClient.factory,
                "mongodb-atlas"
            );
            const db = mongoClient.db("clipp_app");
            const products = db.collection("products");
            let query = {"metadata.imagePath": product_image_path};
            storageRef.listAll()
                .then((result) => {
                    result.items.forEach((imageRef) => {
                        console.log("Pushing promises into list.");
                        promises.push(imageRef.delete().then(() => {
                                console.log("deleted image")
                            })
                        )
                    })
                })
                .then(() => {
                    console.log("Executing all promises");
                    Promise.all(promises)
                        .then(() => {
                            console.log("Deleting metadata");
                            products.deleteOne(query)
                                .then(() => {
                                    resolve(product_image_path)
                                })
                        })
                })
                .catch(err => {
                    reject(err)
                })
        })
    }

    retrieveMetadataForObjectMongo(imagePath) {
        console.log("Deleting pictures of product but not folder");
        return new Promise((resolve, reject) => {
            const stitchAppClient = Stitch.defaultAppClient;
            const mongoClient = stitchAppClient.getServiceClient(
                RemoteMongoClient.factory,
                "mongodb-atlas"
            );
            const db = mongoClient.db("clipp_app");
            const products = db.collection("products");
            const query = {"metadata.imagePath": imagePath};
            products.find(query).asArray()
                .then(docs => {
                    docs.forEach(doc => {
                        resolve(doc.metadata)
                    })
                })
                .catch(err => {
                    reject(err)
                })
        })

    }

    alreadySeen(potential_swipe, left_swiped, right_swiped) {
        console.log("Checking already seen items");
        return (left_swiped.includes(potential_swipe) || right_swiped.includes(potential_swipe))
    }
}

