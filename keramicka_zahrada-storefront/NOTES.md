        <p>{product.tags?.join(", ")}</p>


This will be used for "krehke" tak to get to know if the product is easy to brake or not -> No other needed plugins, also can be used for benefits like resistante to water and frozen enviroments


# TO:DO 
- ADD express-checkout storefront to the current project and create a widget on backend to get the link to the project. using handle and universal data from the backend. And have widget 

//////////////////////////////////////////////////////////////////////////
Use of Sanity plugin: 

You can create a schemas to have the content inside the website 

https://docs.medusajs.com/resources/integrations/guides/sanity

HERE IS ALSO WHISHLIST PLUGIN 

https://docs.medusajs.com/resources/plugins/guides/wishlist



//////////////////////////////////////////////////////////////////////////

THIS IS FOR WHISHLITS PLUGIN - READY ON THE BACKEND BUT NOT PREPARED AND PLUGED IN ON THE FRONEND: 


TO-DO: 
Use all the apis to create, delete and share whislists betweeen users
To add, validate and remove products from whishlits. 
IF the users is not a user in the DB, moved him to create new account and automatically after succesfull registration add his product to the whishlist. 


On the Storefront (Frontend):

Check if a product is in the user's wishlist (by fetching the wishlist and checking for the product/variant).
Add an item to the wishlist (call the POST /store/customers/me/wishlists/items endpoint).
Remove an item from the wishlist (call the DELETE /store/customers/me/wishlists/items/:id endpoint).
Show the user's wishlist (call the GET /store/customers/me/wishlists endpoint).
Share a wishlist (call the POST /store/customers/me/wishlists/share endpoint and use the returned token).
View a shared wishlist (call the GET /store/wishlists/:token endpoint).
In your UI:

Show "Add to Wishlist" or "Remove from Wishlist" buttons based on whether the item is already in the wishlist.
Display the wishlist contents for the user.
Optionally, provide a way to share the wishlist and view shared wishlists.
Summary:
You now have all the backend logic. The next step is to build the UI and connect it to these endpoints, handling add, remove, check, and share actions as needed.


//////////////////////////////////////////////////////////////////////////

THIS IS FOR COMGATE AND ZASILKOVNA PLUGIN (CUSTOM PLUGIN)

Use shipstation-integration plugin and tweek it if its needed for zasilkovna or if its done throught their widget

FOR COMGATE: 

stripe-saved-payment is good plugin to make that baseline to Comgate 
And use Stripe pre-done code to use it for the Comgate integration


//////////////////////////////////////////////////////////////////////////

SEGMENT PLUGIN: THIS IS PLUGIN FOR 

Segment is for reviewing statistics 

