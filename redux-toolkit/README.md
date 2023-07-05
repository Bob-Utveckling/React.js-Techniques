Redux Toolkit use through several dispatches, state update and retrieval,
While also having access to local state.


We configure the store by defining reducers we want from the import of slices.

We create the slices by defining an initial state and reducers in respective data slices.

We use "useSelector" and "useDispatch" to get state values or update them via reducers.
Reducers are called through useDispatch.