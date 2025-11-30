import './Card.css'

const Card = ({ children, className = '', hover = false }) => {
    const classes = `card ${hover ? 'card-hover' : ''} ${className}`.trim()

    return (
        <div className={classes}>
            {children}
        </div>
    )
}

export default Card
