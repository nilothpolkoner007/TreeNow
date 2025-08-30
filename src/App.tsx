@@ .. @@
 import Checkout from './components/checkout';
 import Cart from './components/cart';
 import Payment from './pages/payment';
 import Orders from './components/order';
 import Products from './components/Product';
+import LocationBasedTrees from './components/LocationBasedTrees';
+import AdminLocation from './types/AdminLocation';
 
 function App() {
@@ .. @@
           <Route path='/admin/disease' element={<AdminDiseaseForm />} />
           <Route path='/admin/products' element={<AdminProductsOrders />} />
           <Route path='/admin/order' element={<AdminOrders />} />
+          <Route path='/admin/locations' element={<AdminLocation />} />
+          <Route path='/location-trees' element={<LocationBasedTrees />} />
         </Routes>
       </div>
     </Router>